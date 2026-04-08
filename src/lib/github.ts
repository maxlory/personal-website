export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  fork: boolean;
  updated_at: string;
}

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=20`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 },
    }
  );
  if (!response.ok) return [];
  const repos: GitHubRepo[] = await response.json();
  // Filter out forks, sort by stars desc
  return repos
    .filter((r) => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count);
}
