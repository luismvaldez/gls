export type Contributor = {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
};

export type Commit = {
  sha: string;
  author: {
    login: string;
    avatar_url: string;
    date: string;
  };
  message: string;
};

export type RepositoryDetails = {
  name: string;
  size: number;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string;
  description: string;
  html_url: string;
};

export type RepositoryStats = RepositoryDetails & {
  languages: Record<string, number>;
  topContributors: Contributor[];
  latestCommit: Commit | null;
};

export type WeeklyCommitActivity = {
  week: string;
  total: number;
};

export type StarredRepo = {
  name: string;
  html_url: string;
  stargazers_count: number;
};
