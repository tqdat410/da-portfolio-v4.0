import {
  mapGitHubContributionResponse,
  type GitHubContributionDay,
  type GitHubContributionSnapshot,
  type GitHubGraphqlPayload,
} from "./github-contribution-response";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const GITHUB_GRAPHQL_QUERY = `
  query GitHubContributionActivity($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          months { name totalWeeks year }
          weeks {
            contributionDays { color contributionCount contributionLevel date }
          }
        }
        commitContributionsByRepository(maxRepositories: 6) {
          contributions { totalCount }
          repository { nameWithOwner url }
        }
        issueContributionsByRepository(maxRepositories: 6) {
          contributions { totalCount }
          repository { nameWithOwner url }
        }
        pullRequestContributionsByRepository(maxRepositories: 6) {
          contributions { totalCount }
          repository { nameWithOwner url }
        }
        pullRequestReviewContributionsByRepository(maxRepositories: 6) {
          contributions { totalCount }
          repository { nameWithOwner url }
        }
      }
    }
  }
`;

export type { GitHubContributionDay, GitHubContributionSnapshot, GitHubGraphqlPayload };
export { mapGitHubContributionResponse };

const FIRST_GITHUB_ACTIVITY_YEAR = 2025;

export function extractGitHubUsername(profileUrl: string): string | null {
  return profileUrl.match(/github\.com\/([^/?#]+)/i)?.[1] ?? null;
}

export function getGitHubContributionYears(
  startYear = FIRST_GITHUB_ACTIVITY_YEAR,
  today = new Date()
): number[] {
  const currentYear = today.getUTCFullYear();
  if (startYear > currentYear) return [];

  const years: number[] = [];
  for (let year = currentYear; year >= startYear; year -= 1) {
    years.push(year);
  }

  return years;
}

function getContributionRange(year: number) {
  const from = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
  const to = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

  return { from, to };
}

export async function getGitHubContributionCalendarSnapshot(
  username: string,
  year: number
): Promise<GitHubContributionSnapshot | null> {
  const token = process.env.GITHUB_GRAPHQL_TOKEN ?? process.env.GITHUB_TOKEN;
  if (!token) return null;

  const { from, to } = getContributionRange(year);

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "DaPortfolio-v4/1.0",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      query: GITHUB_GRAPHQL_QUERY,
      variables: { from: from.toISOString(), login: username, to: to.toISOString() },
    }),
    next: { revalidate: 3600 },
  }).catch(() => null);

  if (!response?.ok) return null;

  const payload = (await response.json().catch(() => null)) as GitHubGraphqlPayload | null;
  return mapGitHubContributionResponse(payload, { from, to });
}
