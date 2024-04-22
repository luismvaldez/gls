import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommitActivityGraph from './commit-activity-graph';
import LanguagesList from '@/components/language-list';
import LatestCommit from '@/components/latest-commit';
import RepositoryStats from '@/components/repository-stats';
import TopContributors from '@/components/top-contributors';
import { RepositoryData } from '@/shared/repository-details';

export type RepositoryDetailsProps = {
    repositoryData: RepositoryData;
};

const RepositoryDetails: React.FC<RepositoryDetailsProps> = ({ repositoryData }) => {
    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>{repositoryData.name}</CardTitle>
                <p className="text-sm text-gray-500 mt-2">{repositoryData.description}</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    <RepositoryStats repositoryData={repositoryData} />
                    <section className="grid grid-cols-2 gap-8">
                        <LatestCommit latestCommit={repositoryData.latestCommit} />
                        <TopContributors topContributors={repositoryData.topContributors} />
                    </section>
                    {repositoryData.languages && (
                        <LanguagesList languages={repositoryData.languages} />
                    )}
                    <CommitActivityGraph commitActivity={repositoryData.commitActivity} />
                </div>
            </CardContent>
        </Card>
    );
};

export default RepositoryDetails;