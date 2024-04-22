import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type RepositorySearchFormProps = {
  repoUrl: string;
  setRepoUrl: (url: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
};

const RepositorySearchForm: React.FC<RepositorySearchFormProps> = ({
  repoUrl,
  setRepoUrl,
  handleSubmit,
  isLoading,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          placeholder="Enter GitHub repository URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />
      </div>
      <div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Fetching...' : 'Fetch Data'}
        </Button>
      </div>
    </form>
  );
};

export default RepositorySearchForm;