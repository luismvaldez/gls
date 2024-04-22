import React from 'react';

type LatestCommitProps = {
  latestCommit: {
    message: string;
    author: {
      avatar_url: string;
      date: string;
    };
  };
};

const LatestCommit: React.FC<LatestCommitProps> = ({ latestCommit }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Latest Commit</h2>
      <div className="flex items-center space-x-4">
        <img
          src={latestCommit.author.avatar_url}
          alt="Latest Commit Author"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="text-base">{latestCommit.message}</p>
          <p className="text-sm text-gray-500">{latestCommit.author.date}</p>
        </div>
      </div>
    </div>
  );
};

export default LatestCommit;