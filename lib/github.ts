const GH_API = "https://api.github.com";

function parseRepo(url?: string | null): { owner: string; repo: string } | null {
  if (!url) return null;
  const m = url.match(/github\.com\/([^/\s]+)\/([^/#?\s]+)/i);
  if (!m) return null;
  const owner = m[1];
  const repo = m[2].replace(/\.git$/i, "");
  return { owner, repo };
}

// Fetches the README.md of a GitHub repo using the GITHUB_TOKEN when available
// (falls back to an unauthenticated request for public repos). Returns the raw
// markdown string, or null when it can't be resolved.
export async function getRepoReadme(
  githubUrl?: string | null,
): Promise<string | null> {
  const repo = parseRepo(githubUrl);
  if (!repo) return null;

  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-site",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(`${GH_API}/repos/${repo.owner}/${repo.repo}/readme`, {
      headers,
      // Cache for an hour to avoid hammering the GitHub API on every request.
      next: { revalidate: 60 * 60 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      content?: string;
      encoding?: string;
    };
    if (!data.content) return null;
    return data.encoding === "base64"
      ? Buffer.from(data.content, "base64").toString("utf-8")
      : data.content;
  } catch {
    return null;
  }
}
