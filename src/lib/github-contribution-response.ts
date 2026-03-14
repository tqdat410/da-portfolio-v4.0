const CONTRIBUTION_MIX = [
  { label: "Commits", key: "commitContributionsByRepository", color: "#3fb950" },
  { label: "Pull requests", key: "pullRequestContributionsByRepository", color: "#2f81f7" },
  { label: "Issues", key: "issueContributionsByRepository", color: "#d29922" },
  { label: "Code review", key: "pullRequestReviewContributionsByRepository", color: "#db61a2" },
] as const;

type ContributionMixKey = (typeof CONTRIBUTION_MIX)[number]["key"];

interface GitHubRepositoryBucket {
  contributions: { totalCount: number };
  repository: { nameWithOwner: string; url: string } | null;
}

export interface GitHubGraphqlPayload {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar: {
          months: Array<{ name: string; totalWeeks: number; year: number }>;
          totalContributions: number;
          weeks: Array<{
            contributionDays: Array<{
              color: string;
              contributionCount: number;
              contributionLevel: string;
              date: string;
            }>;
          }>;
        };
        commitContributionsByRepository: GitHubRepositoryBucket[];
        issueContributionsByRepository: GitHubRepositoryBucket[];
        pullRequestContributionsByRepository: GitHubRepositoryBucket[];
        pullRequestReviewContributionsByRepository: GitHubRepositoryBucket[];
      };
    };
  };
  errors?: Array<{ message: string }>;
}

export interface GitHubContributionDay {
  color: string;
  contributionCount: number;
  contributionLevel: string;
  date: string;
  summary: string;
}

export interface GitHubContributionSnapshot {
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
  monthLabels: Array<{ label: string; weekIndex: number }>;
  peakDay: { contributionCount: number; dateLabel: string } | null;
  repositories: Array<{ contributionCount: number; name: string; url: string }>;
  mix: Array<{ color: string; contributionCount: number; label: string; percentage: number }>;
  rangeLabel: string;
  totalContributions: number;
  weeks: GitHubContributionDay[][];
}

const fullDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export function mapGitHubContributionResponse(
  payload: GitHubGraphqlPayload | null,
  range: { from: Date; to: Date }
): GitHubContributionSnapshot | null {
  const collection = payload?.data?.user?.contributionsCollection;
  if (!collection || payload?.errors?.length) return null;

  const weeks = collection.contributionCalendar.weeks.map((week) =>
    week.contributionDays.map((day) => ({
      ...day,
      summary: `${day.contributionCount} contribution${day.contributionCount === 1 ? "" : "s"} on ${fullDateFormatter.format(new Date(day.date))}.`,
    }))
  );
  const days = weeks.flat();
  const activeDays = days.filter((day) => day.contributionCount > 0);
  const streakState = days.reduce(
    (state, day) => {
      const current = day.contributionCount > 0 ? state.current + 1 : 0;
      return { current, longest: Math.max(state.longest, current) };
    },
    { current: 0, longest: 0 }
  );
  const currentStreak = days
    .slice()
    .reverse()
    .findIndex((day) => day.contributionCount === 0);

  let weekIndex = 0;
  const monthLabels = collection.contributionCalendar.months.map((month) => {
    const label =
      month.year === range.to.getUTCFullYear()
        ? month.name.slice(0, 3)
        : `${month.name.slice(0, 3)} '${String(month.year).slice(-2)}`;
    const entry = { label, weekIndex };
    weekIndex += month.totalWeeks;
    return entry;
  });

  const repositoryMap = new Map<string, { contributionCount: number; name: string; url: string }>();
  const mix = CONTRIBUTION_MIX.map((item) => {
    const buckets = collection[item.key as ContributionMixKey];
    const contributionCount = buckets.reduce(
      (total, bucket) => total + bucket.contributions.totalCount,
      0
    );

    buckets.forEach((bucket) => {
      if (!bucket.repository || bucket.contributions.totalCount <= 0) return;
      const existing = repositoryMap.get(bucket.repository.url);
      repositoryMap.set(bucket.repository.url, {
        contributionCount: (existing?.contributionCount ?? 0) + bucket.contributions.totalCount,
        name: bucket.repository.nameWithOwner,
        url: bucket.repository.url,
      });
    });

    return { color: item.color, contributionCount, label: item.label, percentage: 0 };
  });

  const totalMixContributions = mix.reduce((total, item) => total + item.contributionCount, 0);
  const peakDay = activeDays.reduce<GitHubContributionSnapshot["peakDay"]>((best, day) => {
    if (!best || day.contributionCount > best.contributionCount) {
      return {
        contributionCount: day.contributionCount,
        dateLabel: shortDateFormatter.format(new Date(day.date)),
      };
    }
    return best;
  }, null);

  return {
    activeDays: activeDays.length,
    currentStreak: currentStreak === -1 ? activeDays.length : currentStreak,
    longestStreak: streakState.longest,
    monthLabels,
    peakDay,
    repositories: [...repositoryMap.values()]
      .sort((left, right) => right.contributionCount - left.contributionCount)
      .slice(0, 4),
    mix: mix
      .map((item) => ({
        ...item,
        percentage: totalMixContributions
          ? Math.round((item.contributionCount / totalMixContributions) * 100)
          : 0,
      }))
      .filter((item) => item.contributionCount > 0),
    rangeLabel: `${shortDateFormatter.format(range.from)} - ${shortDateFormatter.format(range.to)}`,
    totalContributions: collection.contributionCalendar.totalContributions,
    weeks,
  };
}
