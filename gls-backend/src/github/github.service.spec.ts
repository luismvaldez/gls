import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { GithubService } from './github.service';

describe('GithubService', () => {
  let githubService: GithubService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GithubService,
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              get: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    githubService = module.get<GithubService>(GithubService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getRepositoryStats', () => {
    it('should return repository stats', async () => {
      const owner = 'octocat';
      const repo = 'hello-world';
      const mockResponse = {
        name: 'hello-world',
        size: 1024,
        stargazers_count: 100,
        forks_count: 10,
        open_issues_count: 5,
        language: 'JavaScript',
        description: 'A sample repository',
        html_url: 'https://github.com/octocat/hello-world',
      };

      jest
        .spyOn(httpService.axiosRef, 'get')
        .mockResolvedValueOnce({ data: mockResponse })
        .mockResolvedValueOnce({ data: [] })
        .mockResolvedValueOnce({ data: {} })
        .mockResolvedValueOnce({ data: [] })
        .mockResolvedValueOnce({ data: [] });

      const result = await githubService.getRepositoryStats(owner, repo);

      expect(httpService.axiosRef.get).toHaveBeenCalledTimes(5);
      expect(result).toEqual({
        ...mockResponse,
        commitActivity: [],
        languages: {},
        topContributors: [],
        latestCommit: null,
      });
    });
  });

  describe('getWeeklyCommitActivity', () => {
    it('should return weekly commit activity', async () => {
      const owner = 'octocat';
      const repo = 'hello-world';
      const mockResponse = [
        { week: 1621209600, total: 10 },
        { week: 1621814400, total: 20 },
      ];

      jest
        .spyOn(httpService.axiosRef, 'get')
        .mockResolvedValueOnce({ data: mockResponse });

      const result = await githubService.getWeeklyCommitActivity(owner, repo);

      expect(httpService.axiosRef.get).toHaveBeenCalledWith(
        `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`,
      );
      expect(result).toEqual([
        { week: '2021-05-17', total: 10 },
        { week: '2021-05-24', total: 20 },
      ]);
    });
  });

  describe('getTopStarredRepos', () => {
    it('should return top starred repositories', async () => {
      const mockResponse = {
        items: [
          { name: 'repo1', stargazers_count: 1000 },
          { name: 'repo2', stargazers_count: 500 },
        ],
      };

      jest
        .spyOn(httpService.axiosRef, 'get')
        .mockResolvedValueOnce({ data: mockResponse });

      const result = await githubService.getTopStarredRepos();

      expect(httpService.axiosRef.get).toHaveBeenCalledWith(
        'https://api.github.com/search/repositories?q=stars:>1&sort=stars&order=desc&per_page=10',
        expect.any(Object),
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
