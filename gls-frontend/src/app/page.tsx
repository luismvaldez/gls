/* eslint-disable @next/next/no-img-element */
"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import RepositoryDetails from "@/components/repository-details"
import RepositorySearchForm from "@/components/repository-search"
import TopRepositoriesList from "@/components/top-repositories-list"
import { RepositoryData } from "@/shared/repository-details"
import { fetchTopStarredRepositories, fetchRepositoryData, fetchCommitActivity } from "@/lib/github-api"

export default function RepositoryAnalyticsPage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [topRepositories, setTopRepositories] = useState([]);
  const [isTopReposLoading, setIsTopReposLoading] = useState(false);
  const [topReposError, setTopReposError] = useState('');

  const [repositoryData, setRepositoryData] = useState<RepositoryData>({
    name: "",
    size: 0,
    stargazers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    description: "",
    commitActivity: [],
    languages: {},
    topContributors: [],
    latestCommit: {
      message: "",
      author: {
        date: "",
        avatar_url: "",
      },
    },
  })

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTopRepos = async () => {
      setIsTopReposLoading(true);
      try {
        const data = await fetchTopStarredRepositories();
        setTopRepositories(data.items);
      } catch (error) {
        console.error('Error fetching top repositories:', error);
        setTopReposError('Failed to fetch top repositories. Please try again later.');
      }
      setIsTopReposLoading(false);
    };

    fetchTopRepos();
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const { owner, repo } = parseGitHubUrl(repoUrl);
      const [repoData, activityData] = await Promise.all([
        fetchRepositoryData(owner, repo),
        fetchCommitActivity(owner, repo),
      ]);
      setRepositoryData({
        ...repoData,
        commitActivity: activityData
      });
    } catch (error) {
      setError('Failed to fetch repository data. Please check the URL and try again.');
    }
    setIsLoading(false);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3 } }
  };

  return (
    <div>
      <motion.div
        className="title-section mt-8"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800">GitHub Utilities Dashboard</h1>
      </motion.div>
      <Tabs defaultValue="starred" className="mt-8">
        <TabsList>
          <TabsTrigger value="starred">Top Starred Repos</TabsTrigger>
          <TabsTrigger value="search">Search Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="starred">
          <motion.div variants={cardVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Starred GitHub Repositories</CardTitle>
              </CardHeader>
              <CardContent>
                {topReposError && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{topReposError}</AlertDescription>
                  </Alert>
                )}
                <TopRepositoriesList
                  topRepositories={topRepositories}
                  isLoading={isTopReposLoading}
                />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        <TabsContent value="search">
          <motion.div variants={cardVariants}>
            <Card>
              <CardHeader>
                <CardTitle>GitHub Repository Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div variants={cardVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Search by GitHub repo url</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RepositorySearchForm
                        repoUrl={repoUrl}
                        setRepoUrl={setRepoUrl}
                        handleSubmit={handleSubmit}
                        isLoading={isLoading}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {isLoading && (
                  <motion.div className="mt-8" variants={cardVariants}>
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                    <Skeleton className="h-4 w-1/4 mt-2" />
                  </motion.div>
                )}
                {!isLoading && repositoryData.name && (
                  <motion.div variants={cardVariants}>
                    <RepositoryDetails
                      repositoryData={repositoryData}
                    />
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function parseGitHubUrl(url: string) {
  const regex = /^https?:\/\/github.com\/([^/]+)\/([^/]+)/;
  const match = url.match(regex);

  if (!match) {
    throw new Error('Invalid GitHub repository URL');
  }

  const [, owner, repo] = match;
  return { owner, repo };
}