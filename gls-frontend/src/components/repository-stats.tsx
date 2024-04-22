import React from 'react';
import { Badge } from '@/components/ui/badge';

type RepositoryStatsProps = {
  repositoryData: {
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    size: number;
  };
};

const RepositoryStats: React.FC<RepositoryStatsProps> = ({ repositoryData }) => {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Repository Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Badge variant="outline">stars</Badge>
          <span className="text-lg font-semibold">{repositoryData.stargazers_count}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">forks</Badge>
          <span className="text-lg font-semibold">{repositoryData.forks_count}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">issues</Badge>
          <span className="text-lg font-semibold">{repositoryData.open_issues_count}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">size</Badge>
          <span className="text-lg font-semibold">{repositoryData.size} KB</span>
        </div>
      </div>
    </section>
  );
};

export default RepositoryStats;