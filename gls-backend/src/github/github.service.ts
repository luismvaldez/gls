import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class GithubService {
  private githubApiBaseUrl = 'https://api.github.com';

  constructor(private httpService: HttpService) {}

  async getRepositoryStats(owner: string, repo: string): Promise<any> {
    const repoData = await this.getRepositoryDetails(owner, repo);
    const [commitActivity, languages, contributors, commits] =
      await Promise.all([
        this.getCommitActivity(owner, repo),
        this.getLanguages(owner, repo),
        this.getContributors(owner, repo),
        this.getCommits(owner, repo),
      ]);

    return {
      name: repoData.name,
      size: repoData.size,
      stargazers_count: repoData.stargazers_count,
      forks_count: repoData.forks_count,
      open_issues_count: repoData.open_issues_count,
      language: repoData.language,
      description: repoData.description,
      html_url: repoData.html_url,
      commitActivity,
      languages,
      topContributors: contributors.slice(0, 3),
      latestCommit: commits.length > 0 ? commits[0] : null,
    };
  }

  private async getRepositoryDetails(owner: string, repo: string) {
    const url = `${this.githubApiBaseUrl}/repos/${owner}/${repo}`;
    try {
      const response = await this.get(url);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  private async getCommitActivity(owner: string, repo: string) {
    const url = `${this.githubApiBaseUrl}/repos/${owner}/${repo}/stats/commit_activity`;
    const response = await this.get(url);
    return response.data;
  }

  private async getLanguages(owner: string, repo: string) {
    const url = `${this.githubApiBaseUrl}/repos/${owner}/${repo}/languages`;
    const response = await this.get(url);
    return response.data;
  }

  private async getContributors(owner: string, repo: string) {
    const url = `${this.githubApiBaseUrl}/repos/${owner}/${repo}/contributors`;
    const response = await this.get(url);
    return response.data;
  }

  private async getCommits(owner: string, repo: string) {
    const url = `${this.githubApiBaseUrl}/repos/${owner}/${repo}/commits`;
    const response = await this.get(url);
    return response.data;
  }

  private get(url: string) {
    return this.httpService.axiosRef.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
  }

  async getWeeklyCommitActivity(owner: string, repo: string): Promise<any> {
    const url = `${this.githubApiBaseUrl}/repos/${owner}/${repo}/stats/commit_activity`;
    const response = await this.httpService.axiosRef.get(url);
    if (response.data.length) {
      return response.data.map((week) => ({
        ...week,
        week: new Date(week.week * 1000).toISOString().substring(0, 10),
      }));
    }
    return [];
  }

  async getTopStarredRepos() {
    const url = `${this.githubApiBaseUrl}/search/repositories?q=stars:>1&sort=stars&order=desc&per_page=10`;
    const response = await this.get(url);
    return response.data;
  }
}
