export type RepositoryData = {
    name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    size: number;
    latestCommit: {
        message: string;
        author: {
            avatar_url: string;
            date: string;
        };
    };
    topContributors: {
        id: number;
        login: string;
        avatar_url: string;
    }[];
    languages: Record<string, number>;
    commitActivity: {
        week: string;
        total: number;
        days: number[];
    }[];
};