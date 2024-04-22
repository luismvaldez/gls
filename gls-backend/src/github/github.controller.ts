import { Controller, Get, Query } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github/repos')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('stats')
  getRepoStats(
    @Query('owner') owner: string,
    @Query('repo') repo: string,
  ): Promise<any> {
    return this.githubService.getRepositoryStats(owner, repo);
  }

  @Get('activity')
  getCommitActivity(
    @Query('owner') owner: string,
    @Query('repo') repo: string,
  ): Promise<any> {
    return this.githubService.getWeeklyCommitActivity(owner, repo);
  }

  @Get('top/starred')
  getTopStarredRepos(): Promise<any> {
    return this.githubService.getTopStarredRepos();
  }
}
