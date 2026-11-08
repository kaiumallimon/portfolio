export interface CalendarActivity {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

// Generates 365 days of activity totaling exactly 3,553 contributions
export function getKaiumContributionData(): CalendarActivity[] {
  const result: CalendarActivity[] = [];
  const endDate = new Date(2026, 10, 8); // 8 Nov 2026
  const totalDays = 365;

  // Pseudo-random deterministic generator with seed
  let seed = 42;
  function pseudoRandom() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  // Pre-generate raw weights for each day
  const weights: number[] = [];
  for (let i = 0; i < totalDays; i++) {
    const dayOfWeek = (i % 7);
    // Weekend slightly lower, weekdays higher
    const base = dayOfWeek === 0 || dayOfWeek === 6 ? 0.6 : 1.2;
    const r = pseudoRandom();
    // Burst activity periods simulating sprints
    const sprintBoost = (i > 40 && i < 75) || (i > 150 && i < 210) || (i > 290 && i < 340) ? 1.6 : 1.0;
    const weight = Math.max(0, base * sprintBoost * (0.4 + r * 1.8));
    weights.push(weight);
  }

  const weightSum = weights.reduce((a, b) => a + b, 0);
  const targetTotal = 3553;
  let runningTotal = 0;
  const counts: number[] = [];

  for (let i = 0; i < totalDays; i++) {
    let dayCount = Math.round((weights[i] / weightSum) * targetTotal);
    if (dayCount < 0) dayCount = 0;
    counts.push(dayCount);
    runningTotal += dayCount;
  }

  // Adjust diff to hit exactly 3,553
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

  // Build the ISO date strings
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(endDate);
    d.setDate(endDate.getDate() - (totalDays - 1 - i));
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

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
