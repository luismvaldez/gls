import { Commit } from "@/shared/commit";

export type RepositoryData = {
    name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    size: number;
    latestCommit: Commit;
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