import React from 'react';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

type Repository = {
  name: string;
  html_url: string;
  stargazers_count: number;
};

type TopRepositoriesListProps = {
  topRepositories: Repository[];
  isLoading: boolean;
};

const TopRepositoriesList: React.FC<TopRepositoriesListProps> = ({ topRepositories, isLoading }) => {
  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-6" />
          <Skeleton className="h-6" />
          <Skeleton className="h-6" />
          <Skeleton className="h-6" />
          <Skeleton className="h-6" />
        </div>
      ) : topRepositories.length > 0 ? (
        <div className="space-y-2">
          {topRepositories.map(repo => (
            <Alert key={repo.name} variant="default">
              <div className="flex items-center justify-between w-full">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm"
                >
                  {repo.name}
                </a>
                <Badge variant="secondary">
                  {repo.stargazers_count} Stars
                </Badge>
              </div>
            </Alert>
          ))}
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default TopRepositoriesList;