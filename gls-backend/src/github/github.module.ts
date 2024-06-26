import { Module } from '@nestjs/common';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [GithubService],
  imports: [HttpModule],
  controllers: [GithubController],
})
export class GithubModule {}
