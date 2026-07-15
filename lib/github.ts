const GH_API = "https://api.github.com";

function parseRepo(url?: string | null): { owner: string; repo: string } | null {
  if (!url) return null;
  const m = url.match(/github\.com\/([^/\s]+)\/([^/#?\s]+)/i);
  if (!m) return null;
  const owner = m[1];
  const repo = m[2].replace(/\.git$/i, "");
  return { owner, repo };
}

async function fetchText(
  url: string,
  token?: string,
  accept = "text/plain",
): Promise<string | null> {
  const headers: Record<string, string> = {
    "User-Agent": "portfolio-site",
    Accept: accept,
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) return null;
  return res.text();
}

// Fetches the README.md of a GitHub repo using the GITHUB_TOKEN when available.
// Tries the REST API first (handles the default branch + private repos with a
// token that has access), then falls back to the raw file on main/master.
// Returns the raw markdown string, or null when it can't be resolved.
export async function getRepoReadme(
  githubUrl?: string | null,
): Promise<string | null> {
  const repo = parseRepo(githubUrl);
  if (!repo) return null;

  const token = process.env.GITHUB_FINE_GRAINED_TOKEN;

  // 1) REST API — most reliable, supports private repos when the token has access.
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "portfolio-site",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(
      `${GH_API}/repos/${repo.owner}/${repo.repo}/readme`,
      { headers, cache: "no-store" },
    );

    if (res.ok) {
      const data = (await res.json()) as {
        content?: string;
        encoding?: string;
      };
      if (data.content) {
        return data.encoding === "base64"
          ? Buffer.from(data.content, "base64").toString("utf-8")
          : data.content;
      }
    } else if (res.status !== 404) {
      console.warn(
        `[github] README API returned ${res.status} for ${repo.owner}/${repo.repo}`,
      );
    }
  } catch (err) {
    console.warn(`[github] README API request failed:`, err);
  }

  // 2) Raw fallback for repos/branches the API missed.
  for (const branch of ["main", "master"]) {
    const raw = await fetchText(
      `https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/${branch}/README.md`,
      token,
    );
    if (raw && raw.length > 0) return raw;
  }

  return null;
}

// ---------------------------------------------------------------------------
// Project-scoped statistics (require Contents: Read + Metadata: Read on a
// fine-grained token). Stats endpoints may return 202 while GitHub computes
// them, so we poll a few times before giving up.
// ---------------------------------------------------------------------------

function ghHeaders(token?: string): Record<string, string> {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-site",
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function ghJson(
  url: string,
  token?: string,
  poll = false,
): Promise<unknown | null> {
  const attempts = poll ? 3 : 1;
  for (let i = 0; i < attempts; i++) {
    const res = await fetch(url, { headers: ghHeaders(token), cache: "no-store" });
    if (poll && res.status === 202) {
      await sleep(800);
      continue;
    }
    if (!res.ok) return null;
    return await res.json();
  }
  return null;
}

export interface RepoMeta {
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  language: string | null;
  license: string | null;
  createdAt: string | null;
  defaultBranch: string | null;
  topics: string[];
  sizeKb: number;
  htmlUrl: string | null;
}

export async function getRepoMeta(
  githubUrl?: string | null,
): Promise<RepoMeta | null> {
  const repo = parseRepo(githubUrl);
  if (!repo) return null;
  const j = (await ghJson(
    `https://api.github.com/repos/${repo.owner}/${repo.repo}`,
    process.env.GITHUB_FINE_GRAINED_TOKEN,
  )) as Record<string, unknown> | null;
  if (!j) return null;
  return {
    stars: (j.stargazers_count as number) ?? 0,
    forks: (j.forks_count as number) ?? 0,
    openIssues: (j.open_issues_count as number) ?? 0,
    watchers: (j.subscribers_count as number) ?? (j.watchers_count as number) ?? 0,
    language: (j.language as string) ?? null,
    license: ((j.license as Record<string, unknown> | null)?.spdx_id as string) ?? null,
    createdAt: (j.created_at as string) ?? null,
    defaultBranch: (j.default_branch as string) ?? null,
    topics: (j.topics as string[]) ?? [],
    sizeKb: (j.size as number) ?? 0,
    htmlUrl: (j.html_url as string) ?? null,
  };
}

export async function getRepoLanguages(
  githubUrl?: string | null,
): Promise<{ name: string; bytes: number }[] | null> {
  const repo = parseRepo(githubUrl);
  if (!repo) return null;
  const j = (await ghJson(
    `https://api.github.com/repos/${repo.owner}/${repo.repo}/languages`,
    process.env.GITHUB_FINE_GRAINED_TOKEN,
  )) as Record<string, number> | null;
  if (!j || typeof j !== "object") return null;
  const entries = Object.entries(j)
    .map(([name, bytes]) => ({ name, bytes }))
    .sort((a, b) => b.bytes - a.bytes);
  return entries.length > 0 ? entries : null;
}

export async function getRepoCommitActivity(
  githubUrl?: string | null,
): Promise<{ week: number; total: number }[] | null> {
  const repo = parseRepo(githubUrl);
  if (!repo) return null;
  const j = (await ghJson(
    `https://api.github.com/repos/${repo.owner}/${repo.repo}/stats/commit_activity`,
    process.env.GITHUB_FINE_GRAINED_TOKEN,
    true,
  )) as { week: number; total: number }[] | null;
  if (!Array.isArray(j) || j.length === 0) return null;
  return j.map((w) => ({ week: w.week, total: w.total }));
}

export interface RepoContributor {
  login: string;
  avatar: string;
  contributions: number;
  additions: number;
  deletions: number;
}

export async function getRepoContributors(
  githubUrl?: string | null,
): Promise<RepoContributor[] | null> {
  const repo = parseRepo(githubUrl);
  if (!repo) return null;
  const j = (await ghJson(
    `https://api.github.com/repos/${repo.owner}/${repo.repo}/stats/contributors?per_page=8`,
    process.env.GITHUB_FINE_GRAINED_TOKEN,
    true,
  )) as
    | { author?: { login?: string; avatar_url?: string }; total?: number; weeks?: { a?: number; d?: number }[] }[]
    | null;
  if (!Array.isArray(j) || j.length === 0) return null;
  return j
    .map((c) => {
      const weeks = Array.isArray(c.weeks) ? c.weeks : [];
      const additions = weeks.reduce((s, w) => s + (w.a ?? 0), 0);
      const deletions = weeks.reduce((s, w) => s + (w.d ?? 0), 0);
      return {
        login: c.author?.login ?? "unknown",
        avatar: c.author?.avatar_url ?? "",
        contributions: c.total ?? 0,
        additions,
        deletions,
      };
    })
    .sort((a, b) => b.contributions - a.contributions);
}
