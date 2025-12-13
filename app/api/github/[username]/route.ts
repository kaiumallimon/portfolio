import { NextRequest, NextResponse } from "next/server";

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface Repository {
  name: string;
  stargazers_count: number;
  language: string | null;
}

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  // Debug: Check if token exists
  const hasToken = !!process.env.GITHUB_TOKEN;
  console.log("=== GitHub API Debug ===");
  console.log("Username:", username);
  console.log("Token exists:", hasToken);
  console.log("Token preview:", hasToken ? process.env.GITHUB_TOKEN?.substring(0, 7) + "..." : "NOT SET");

  try {
    /* ---------------- USER PROFILE ---------------- */
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
    });

    console.log("User API status:", userRes.status);

    if (!userRes.ok) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user: GitHubUser = await userRes.json();

    /* ---------------- REPOSITORIES ---------------- */
    const repoRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );

    console.log("Repo API status:", repoRes.status);

    const repos: Repository[] = repoRes.ok ? await repoRes.json() : [];

    const totalStars = repos.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0
    );

    const languageDistribution: Record<string, number> = {};
    repos.forEach((repo) => {
      if (repo.language) {
        languageDistribution[repo.language] =
          (languageDistribution[repo.language] || 0) + 1;
      }
    });

    const topLanguage =
      Object.entries(languageDistribution).sort((a, b) => b[1] - a[1])[0]?.[0] ??
      "Unknown";

    /* ---------------- CONTRIBUTIONS (GRAPHQL) ---------------- */
    let totalContributions = 0;
    let contributionDays: ContributionDay[] = [];

    console.log("Fetching contribution data for:", username);

    if (process.env.GITHUB_TOKEN) {
      try {
        const graphqlRes = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query ($username: String!) {
                user(login: $username) {
                  contributionsCollection {
                    contributionCalendar {
                      totalContributions
                      weeks {
                        contributionDays {
                          date
                          contributionCount
                          contributionLevel
                        }
                      }
                    }
                  }
                }
              }
            `,
            variables: {
              username
            },
          }),
        });

        console.log("GraphQL API status:", graphqlRes.status);

        if (graphqlRes.ok) {
          const data = await graphqlRes.json();

          // Debug: Log the full response
          console.log("GraphQL response:", JSON.stringify(data, null, 2));

          // Check for GraphQL errors
          if (data.errors) {
            console.error("❌ GraphQL errors:", data.errors);
          }

          const calendar =
            data?.data?.user?.contributionsCollection?.contributionCalendar;

          if (calendar) {
            totalContributions = calendar.totalContributions;
            console.log("✅ Total contributions found:", totalContributions);

            contributionDays = calendar.weeks.flatMap((week: any) =>
              week.contributionDays.map((day: any) => ({
                date: day.date,
                count: day.contributionCount,
                level:
                  day.contributionLevel === "NONE"
                    ? 0
                    : day.contributionLevel === "FIRST_QUARTILE"
                    ? 1
                    : day.contributionLevel === "SECOND_QUARTILE"
                    ? 2
                    : day.contributionLevel === "THIRD_QUARTILE"
                    ? 3
                    : 4,
              }))
            );
            console.log("Contribution days array length:", contributionDays.length);
          } else {
            console.error("❌ No calendar data in response");
          }
        } else {
          const errorText = await graphqlRes.text();
          console.error("❌ GraphQL request failed:", errorText);
        }
      } catch (graphqlError) {
        console.error("❌ GraphQL fetch error:", graphqlError);
      }
    } else {
      console.error("❌ GITHUB_TOKEN not set - contribution data unavailable");
    }

    /* ---------------- STREAK CALCULATION ---------------- */
    let longestStreak = 0;
    let currentStreak = 0;
    let lastDate: number | null = null;

    const daysWithContributions = contributionDays
      .filter((d) => d.count > 0)
      .sort((a, b) => +new Date(a.date) - +new Date(b.date));

    daysWithContributions.forEach((day) => {
      const current = +new Date(day.date);
      if (lastDate && current - lastDate === 86400000) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
      longestStreak = Math.max(longestStreak, currentStreak);
      lastDate = current;
    });

    /* ---------------- ACTIVITY ---------------- */
    const dayMap: Record<string, number> = {};
    const monthMap: Record<string, number> = {};

    contributionDays.forEach((d) => {
      const date = new Date(d.date);
      const day = date.toLocaleDateString("en-US", { weekday: "long" });
      const month = date.toLocaleDateString("en-US", { month: "long" });

      dayMap[day] = (dayMap[day] || 0) + d.count;
      monthMap[month] = (monthMap[month] || 0) + d.count;
    });

    const mostActiveDay =
      Object.entries(dayMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Unknown";

    const mostActiveMonth =
      Object.entries(monthMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Unknown";

    /* ---------------- GAMIFICATION ---------------- */
    const score = totalStars + totalContributions;

    const universalRank =
      score > 10000
        ? "Top 1%"
        : score > 5000
        ? "Top 2%"
        : score > 2000
        ? "Top 5%"
        : score > 1000
        ? "Top 10%"
        : "Top 20%";

    const powerLevel =
      totalContributions > 2000
        ? "Elite Class"
        : totalContributions > 1000
        ? "Master Class"
        : totalContributions > 500
        ? "Expert Class"
        : totalContributions > 200
        ? "Advanced Class"
        : "Beginner Class";

    console.log("=== Final Stats ===");
    console.log("Total contributions:", totalContributions);
    console.log("Total stars:", totalStars);
    console.log("Longest streak:", longestStreak);

    /* ---------------- RESPONSE ---------------- */
    return NextResponse.json({
      user,
      stats: {
        totalContributions,
        totalStars,
        totalRepos: repos.length,
        topLanguage,
        longestStreak,
        mostActiveDay,
        mostActiveMonth,
        universalRank,
        powerLevel,
      },
      contributionDays,
      languageDistribution,
      debug: {
        hasToken,
        contributionDaysCount: contributionDays.length
      }
    });
  } catch (err) {
    console.error("❌ API Error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
