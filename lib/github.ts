const GH_API = "https://api.github.com";

export function parseRepo(url?: string | null): { owner: string; repo: string } | null {
  if (!url) return null;
  const m = url.match(/github\.com\/([^/\s]+)\/([^/#?\s]+)/i);
  if (!m) return null;
  const owner = m[1];
  const repo = m[2].replace(/\.git$/i, "");
  return { owner, repo };
}

function ghHeaders(token?: string): Record<string, string> {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "kaiumallimon-portfolio",
  };
  const activeToken =
    token ||
    process.env.GITHUB_FINE_GRAINED_TOKEN ||
    process.env.GITHUB_TOKEN;
  if (activeToken) h.Authorization = `Bearer ${activeToken}`;
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

function getHtmlAttr(tagAttrs: string, attrName: string): string {
  const quoted = tagAttrs.match(new RegExp(`${attrName}=["']([^"']*)["']`, "i"));
  if (quoted) return quoted[1].trim();
  const unquoted = tagAttrs.match(new RegExp(`${attrName}=([^\\s>]+)`, "i"));
  return unquoted ? unquoted[1].trim() : "";
}

export function sanitizeAndResolveReadme(
  markdown: string,
  rawBase?: string
): string {
  if (!markdown) return "";

  let result = markdown;

  // 1. Transform <a href="..."><img .../></a> into markdown [![alt](imgUrl)](linkUrl)
  result = result.replace(
    /<a\s+([^>]*?)>\s*<img\s+([^>]*?)\/?>\s*<\/a>/gi,
    (match, aAttrs, imgAttrs) => {
      const href = getHtmlAttr(aAttrs, "href");
      let src = getHtmlAttr(imgAttrs, "src");
      const alt = getHtmlAttr(imgAttrs, "alt");
      if (!src) return match;
      if (
        rawBase &&
        !src.startsWith("http://") &&
        !src.startsWith("https://") &&
        !src.startsWith("//")
      ) {
        const cleanSrc = src.replace(/^\.?\//, "");
        src = `${rawBase}/${cleanSrc}`;
      }
      return `\n\n[![${alt}](${src})](${href})\n\n`;
    }
  );

  // 2. Transform standalone <img ...> HTML tags to markdown ![alt](src)
  result = result.replace(/<img\s+([^>]*?)\/?>/gi, (match, attrs) => {
    let src = getHtmlAttr(attrs, "src");
    const alt = getHtmlAttr(attrs, "alt");
    if (!src) return match;

    if (
      rawBase &&
      !src.startsWith("http://") &&
      !src.startsWith("https://") &&
      !src.startsWith("//")
    ) {
      const cleanSrc = src.replace(/^\.?\//, "");
      src = `${rawBase}/${cleanSrc}`;
    }

    return `\n\n![${alt}](${src})\n\n`;
  });

  // 3. Transform relative markdown images ![alt](path)
  if (rawBase) {
    result = result.replace(
      /!\[(.*?)\]\(((?!https?:\/\/|\/\/)[^)]+)\)/g,
      (_match, alt, src) => {
        const cleanSrc = src.trim().replace(/^\.?\//, "");
        return `![${alt}](${rawBase}/${cleanSrc})`;
      }
    );
  }

  // 4. Strip leftover layout wrapper tags like <div ...>, </div>, <p ...>, </p>, <center>, </center>
  result = result.replace(/<\/?(div|p|center)[^>]*>/gi, "\n\n");

  // 5. Convert <br> or <br/> to markdown linebreaks
  result = result.replace(/<br\s*\/?>/gi, "  \n");

  // 6. Clean up excessive consecutive newlines
  result = result.replace(/\n{3,}/g, "\n\n");

  return result.trim();
}

export async function getRepoReadme(
  githubUrl?: string | null,
): Promise<string | null> {
  const repo = parseRepo(githubUrl);
  if (!repo) return null;

  try {
    const res = await fetch(
      `${GH_API}/repos/${repo.owner}/${repo.repo}/readme`,
      { headers: ghHeaders(), cache: "no-store" },
    );

    if (res.ok) {
      const data = (await res.json()) as {
        content?: string;
        encoding?: string;
        download_url?: string;
      };
      if (data.content) {
        const text =
          data.encoding === "base64"
            ? Buffer.from(data.content, "base64").toString("utf-8")
            : data.content;

        const rawBase = data.download_url
          ? data.download_url.substring(0, data.download_url.lastIndexOf("/"))
          : `https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/main`;

        return sanitizeAndResolveReadme(text, rawBase);
      }
    }
  } catch (err) {
    console.warn(`[github] README API request failed:`, err);
  }

  return null;
}

export async function getRepoMeta(
  githubUrl?: string | null,
): Promise<RepoMeta | null> {
  const repo = parseRepo(githubUrl);
  if (!repo) return null;
  const j = (await ghJson(
    `${GH_API}/repos/${repo.owner}/${repo.repo}`,
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
    `${GH_API}/repos/${repo.owner}/${repo.repo}/languages`,
  )) as Record<string, number> | null;
  if (!j || typeof j !== "object") return null;
  const entries = Object.entries(j)
    .map(([name, bytes]) => ({ name, bytes }))
    .sort((a, b) => b.bytes - a.bytes);
  return entries.length > 0 ? entries : null;
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
    `${GH_API}/repos/${repo.owner}/${repo.repo}/stats/contributors?per_page=8`,
    undefined,
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

export interface GitHubStats {
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  followers: number;
  avatarUrl: string;
  bio: string | null;
  login: string;
  topLanguages: { name: string; count: number; percentage: number }[];
}

export async function fetchGitHubStats(username?: string): Promise<GitHubStats | null> {
  const user = username || process.env.GITHUB_USERNAME || "kaiumallimon";
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_FINE_GRAINED_TOKEN;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "kaiumallimon-portfolio",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${GH_API}/users/${user}`, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return null;
    }

    const userData = await res.json();

    const reposRes = await fetch(`${GH_API}/users/${user}/repos?per_page=100&sort=updated`, {
      headers,
      next: { revalidate: 3600 },
    });

    let totalStars = 0;
    let totalForks = 0;
    const languageCounts: Record<string, number> = {};

    if (reposRes.ok) {
      const repos = await reposRes.json();
      if (Array.isArray(repos)) {
        for (const repo of repos) {
          if (!repo.fork) {
            totalStars += repo.stargazers_count || 0;
            totalForks += repo.forks_count || 0;
            if (repo.language) {
              languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
            }
          }
        }
      }
    }

    const totalLangInstances = Object.values(languageCounts).reduce((a, b) => a + b, 0) || 1;
    const topLanguages = Object.entries(languageCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalLangInstances) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      publicRepos: userData.public_repos || 0,
      totalStars,
      totalForks,
      followers: userData.followers || 0,
      avatarUrl: userData.avatar_url || "https://github.com/kaiumallimon.png",
      bio: userData.bio,
      login: userData.login,
      topLanguages,
    };
  } catch (err) {
    console.warn("[GitHub API] Error fetching stats:", err);
    return null;
  }
}
