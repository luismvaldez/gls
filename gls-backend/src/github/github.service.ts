import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import {
  RepositoryStats,
  RepositoryDetails,
  Contributor,
  Commit,
  WeeklyCommitActivity,
  StarredRepo,
} from './types';

@Injectable()
export class GithubService {
  private githubApiBaseUrl = 'https://api.github.com';

  constructor(private httpService: HttpService) {}

  async getRepositoryStats(
    owner: string,
    repo: string,
  ): Promise<RepositoryStats> {
    const repoData = await this.getRepositoryDetails(owner, repo);
    const [languages, contributors, commits] = await Promise.all([
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
      languages,
      topContributors: contributors.slice(0, 3),
      latestCommit: commits.length > 0 ? commits[0] : null,
    };
  }

  private async getRepositoryDetails(
    owner: string,
    repo: string,
  ): Promise<RepositoryDetails | null> {
    const url = `${this.githubApiBaseUrl}/repos/${owner}/${repo}`;
    try {
      const response = await this.get<RepositoryDetails>(url);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  private async getCommitActivity(
    owner: string,
    repo: string,
  ): Promise<unknown[]> {
    const url = `${this.githubApiBaseUrl}/repos/${owner}/${repo}/stats/commit_activity`;
    const response = await this.get<unknown[]>(url);
    return response.data;
  }

  private async getLanguages(
    owner: string,
    repo: string,
  ): Promise<Record<string, number>> {
    const url = `${this.githubApiBaseUrl}/repos/${owner}/${repo}/languages`;
    const response = await this.get<Record<string, number>>(url);
    return response.data;
  }

  private async getContributors(
    owner: string,
    repo: string,
  ): Promise<Contributor[]> {
    const url = `${this.githubApiBaseUrl}/repos/${owner}/${repo}/contributors`;
    const response = await this.get<Contributor[]>(url);
    return response.data;
  }

  private async getCommits(owner: string, repo: string): Promise<Commit[]> {
    const url = `${this.githubApiBaseUrl}/repos/${owner}/${repo}/commits`;
    const response = await this.get<Commit[]>(url);
    return response.data;
  }

  private get<T>(url: string): Promise<AxiosResponse<T>> {
    return this.httpService.axiosRef.get<T>(url, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
  }

  async getWeeklyCommitActivity(
    owner: string,
    repo: string,
  ): Promise<WeeklyCommitActivity[]> {
    const url = `${this.githubApiBaseUrl}/repos/${owner}/${repo}/stats/commit_activity`;
    const response = await this.httpService.axiosRef.get<unknown[]>(url);
    if (response.data.length) {
      return response.data.map((week: any) => ({
        ...week,
        week: new Date(week.week * 1000).toISOString().substring(0, 10),
      }));
    }
    return [];
  }

  async getTopStarredRepos(): Promise<StarredRepo[]> {
    const url = `${this.githubApiBaseUrl}/search/repositories?q=stars:>1&sort=stars&order=desc&per_page=10`;
    const response = await this.get<{ items: StarredRepo[] }>(url);
    return response.data.items;
  }
}
