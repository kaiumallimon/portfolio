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

  const token = process.env.GITHUB_TOKEN;

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
