import { NextRequest, NextResponse } from "next/server";
import cacheData from "@/lib/github-contributions-cache.json";

const GH_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

const QUERY = `
query ($username: String!, $from: DateTime, $to: DateTime) {
  user(login: $username) {
    contributionsCollection(from: $from, to: $to) {
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
`;

function levelToNumber(lvl: string): 0 | 1 | 2 | 3 | 4 {
  switch (lvl) {
    case "FIRST_QUARTILE":
      return 1;
    case "SECOND_QUARTILE":
      return 2;
    case "THIRD_QUARTILE":
      return 3;
    case "FOURTH_QUARTILE":
      return 4;
    default:
      return 0;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const yearParam = searchParams.get("year");
  const username =
    searchParams.get("username") ||
    process.env.GITHUB_USERNAME ||
    "kaiumallimon";
  const now = new Date();
  const currentYear = now.getFullYear();
  const year = yearParam ? parseInt(yearParam, 10) : currentYear;

  const token =
    process.env.GITHUB_TOKEN || process.env.GITHUB_FINE_GRAINED_TOKEN;

  // Running year is strictly calculated from Jan 01 to today's date
  const isRunningYear = year === currentYear;
  const from = `${year}-01-01T00:00:00Z`;
  const to = isRunningYear ? now.toISOString() : `${year}-12-31T23:59:59Z`;

  const startStr = `1 Jan ${year}`;
  const endStr = isRunningYear
    ? now.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : `31 Dec ${year}`;
  const dateRange = `${startStr} — ${endStr}`;

  if (token) {
    try {
      const res = await fetch(GH_GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": "kaiumallimon-portfolio",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: QUERY,
          variables: { username, from, to },
        }),
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const json = await res.json();
        const cal =
          json?.data?.user?.contributionsCollection?.contributionCalendar;
        if (cal) {
          const days = (
            cal.weeks?.flatMap((w: { contributionDays: Array<{ date: string; contributionCount: number; contributionLevel: string }> }) => w.contributionDays) || []
          ).map((d: { date: string; contributionCount: number; contributionLevel: string }) => ({
            date: d.date,
            count: d.contributionCount,
            level: levelToNumber(d.contributionLevel),
          }));
          const total =
            cal.totalContributions ??
            days.reduce((a: number, b: { count: number }) => a + b.count, 0);

          // Pad remaining days of running year up to Dec 31 with empty cells (level 0) so the matrix does not shrink
          if (isRunningYear && days.length > 0) {
            const lastDateStr = days[days.length - 1].date;
            const [ly, lm, ld] = lastDateStr.split("-").map(Number);
            const curr = new Date(ly, lm - 1, ld);
            curr.setDate(curr.getDate() + 1);
            const endDate = new Date(year, 11, 31);
            while (curr <= endDate) {
              const yStr = curr.getFullYear();
              const mStr = String(curr.getMonth() + 1).padStart(2, "0");
              const dStr = String(curr.getDate()).padStart(2, "0");
              days.push({
                date: `${yStr}-${mStr}-${dStr}`,
                count: 0,
                level: 0,
              });
              curr.setDate(curr.getDate() + 1);
            }
          }

          return NextResponse.json({
            year,
            label: String(year),
            total,
            dateRange,
            data: days,
          });
        }
      }
    } catch (err) {
      console.warn("[GitHub Contributions API] fetch error, using cache:", err);
    }
  }

  // Fallback to cached real data
  const fallback = (cacheData as Record<string, unknown>)[String(year)];
  if (fallback) {
    return NextResponse.json(fallback);
  }

  return NextResponse.json(
    { error: "No contribution data found" },
    { status: 404 }
  );
}
