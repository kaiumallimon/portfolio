export interface CalendarActivity {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface YearContributionInfo {
  year: number;
  label: string;
  total: number;
  dateRange: string;
  data: CalendarActivity[];
}

function generateDeterministicActivities(
  startDate: Date,
  totalDays: number,
  targetTotal: number,
  seedVal: number
): CalendarActivity[] {
  let seed = seedVal;
  function pseudoRandom() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  const weights: number[] = [];
  for (let i = 0; i < totalDays; i++) {
    const dayOfWeek = i % 7;
    const base = dayOfWeek === 0 || dayOfWeek === 6 ? 0.6 : 1.25;
    const r = pseudoRandom();
    const sprintBoost =
      (i > 30 && i < 75) || (i > 140 && i < 205) || (i > 270 && i < 335)
        ? 1.55
        : 1.0;
    weights.push(Math.max(0, base * sprintBoost * (0.35 + r * 1.85)));
  }

  const weightSum = weights.reduce((a, b) => a + b, 0);
  const counts: number[] = [];
  let runningTotal = 0;

  for (let i = 0; i < totalDays; i++) {
    let dayCount = Math.round((weights[i] / weightSum) * targetTotal);
    if (dayCount < 0) dayCount = 0;
    counts.push(dayCount);
    runningTotal += dayCount;
  }

  // Adjust diff to hit exactly targetTotal
  let diff = targetTotal - runningTotal;
  let idx = 0;
  while (diff !== 0) {
    if (diff > 0) {
      counts[idx % totalDays]++;
      diff--;
    } else {
      if (counts[idx % totalDays] > 0) {
        counts[idx % totalDays]--;
        diff++;
      }
    }
    idx++;
  }

  const result: CalendarActivity[] = [];
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${day}`;

    const count = counts[i];
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count > 0 && count <= 4) level = 1;
    else if (count > 4 && count <= 9) level = 2;
    else if (count > 9 && count <= 16) level = 3;
    else if (count > 16) level = 4;

    result.push({
      date: dateStr,
      count,
      level,
    });
  }

  return result;
}

// 2026: Running year (rolling 365 days ending Nov 8, 2026)
const activities2026 = generateDeterministicActivities(
  new Date(2025, 10, 9), // 9 Nov 2025
  365,
  3553,
  42
);

// 2025: 1 Jan 2025 — 31 Dec 2025
const activities2025 = generateDeterministicActivities(
  new Date(2025, 0, 1),
  365,
  2840,
  101
);

// 2024: 1 Jan 2024 — 31 Dec 2024 (Leap year: 366 days)
const activities2024 = generateDeterministicActivities(
  new Date(2024, 0, 1),
  366,
  2195,
  202
);

// 2023: 1 Jan 2023 — 31 Dec 2023
const activities2023 = generateDeterministicActivities(
  new Date(2023, 0, 1),
  365,
  1640,
  303
);

export const AVAILABLE_YEARS: YearContributionInfo[] = [
  {
    year: 2026,
    label: "2026",
    total: 3553,
    dateRange: "9 Nov 2025 — 8 Nov 2026",
    data: activities2026,
  },
  {
    year: 2025,
    label: "2025",
    total: 2840,
    dateRange: "1 Jan 2025 — 31 Dec 2025",
    data: activities2025,
  },
  {
    year: 2024,
    label: "2024",
    total: 2195,
    dateRange: "1 Jan 2024 — 31 Dec 2024",
    data: activities2024,
  },
  {
    year: 2023,
    label: "2023",
    total: 1640,
    dateRange: "1 Jan 2023 — 31 Dec 2023",
    data: activities2023,
  },
];

export function getKaiumContributionData(): CalendarActivity[] {
  return activities2026;
}

export function getContributionByYear(year: number): YearContributionInfo {
  return AVAILABLE_YEARS.find((y) => y.year === year) || AVAILABLE_YEARS[0];
}
