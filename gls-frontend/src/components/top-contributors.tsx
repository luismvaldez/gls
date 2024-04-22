import React from 'react';

type Contributor = {
  id: number;
  login: string;
  avatar_url: string;
};

type TopContributorsProps = {
  topContributors: Contributor[];
};

const TopContributors: React.FC<TopContributorsProps> = ({ topContributors }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Top Contributors</h2>
      <ul className="space-y-4">
        {topContributors.map((contributor) => (
          <li key={contributor.id} className="flex items-center space-x-4">
            <img src={contributor.avatar_url} alt="Contributor Avatar" className="w-10 h-10 rounded-full" />
            <span className="text-base">{contributor.login}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopContributors;