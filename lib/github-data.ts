import cacheData from "./github-contributions-cache.json";

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

const rawCache = cacheData as Record<
  string,
  {
    year: number;
    label: string;
    total: number;
    dateRange: string;
    data: CalendarActivity[];
  }
>;

export const AVAILABLE_YEARS: YearContributionInfo[] = [
  rawCache["2026"],
  rawCache["2025"],
  rawCache["2024"],
  rawCache["2023"],
].filter(Boolean);

export function getKaiumContributionData(): CalendarActivity[] {
  return rawCache["2026"]?.data || [];
}

export function getContributionByYear(year: number): YearContributionInfo {
  return (
    rawCache[String(year)] ||
    AVAILABLE_YEARS.find((y) => y.year === year) ||
    AVAILABLE_YEARS[0]
  );
}
