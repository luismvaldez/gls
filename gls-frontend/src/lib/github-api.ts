const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchTopStarredRepositories() {
  const response = await fetch(`${API_BASE_URL}/github/repos/top/starred`);
  const data = await response.json();
  return data;
}

export async function fetchRepositoryData(owner: string, repo: string) {
  const response = await fetch(`${API_BASE_URL}/github/repos/stats?owner=${owner}&repo=${repo}`);
  const data = await response.json();
  return data;
}

export async function fetchCommitActivity(owner: string, repo: string) {
  const response = await fetch(`${API_BASE_URL}/github/repos/activity?owner=${owner}&repo=${repo}`);
  const data = await response.json();
  return data;
}