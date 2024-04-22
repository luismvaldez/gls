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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "lucide-react"

export default function RepositoryAnalyticsPage() {
  const [repoUrl, setRepoUrl] = useState('')
  const [topRepositories, setTopRepositories] = useState([])
  const [isTopReposLoading, setIsTopReposLoading] = useState(false)
  const [topReposError, setTopReposError] = useState('')

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
      committer: {
        date: "",
      },
      author: {
        date: "",
        avatar_url: "",
      },
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTopRepos = async () => {
      setIsTopReposLoading(true)
      try {
        const data = await fetchTopStarredRepositories()
        setTopRepositories(data.items)
      } catch (error) {
        setTopReposError('Failed to fetch top repositories. Please try again later.')
      }
      setIsTopReposLoading(false)
    }

    fetchTopRepos()
  }, [])

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const { owner, repo } = parseGitHubUrl(repoUrl)
      const [repoData, activityData] = await Promise.all([
        fetchRepositoryData(owner, repo),
        fetchCommitActivity(owner, repo),
      ])
      setRepositoryData({
        ...repoData,
        commitActivity: activityData,
        latestCommit: {
          ...repoData.latestCommit?.commit,
          author: repoData.latestCommit?.author,
        },
      })
    } catch (error) {
      setError('Failed to fetch repository data. Please check the URL and try again.')
    }
    setIsLoading(false)
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3 } },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <motion.div
          className="text-center"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            GitHub Repository Analytics
          </h1>
          <p className="mt-3 text-xl text-gray-300 sm:mt-5">
            Explore and analyze GitHub repositories with ease
          </p>
        </motion.div>

        <div className="mt-12">
          <Tabs defaultValue="search" className="max-w-2xl mx-auto">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="starred">Top Starred</TabsTrigger>
            </TabsList>
            <TabsContent value="search">
              <motion.div variants={cardVariants}>
                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle>Search GitHub Repository</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="repoUrl">Repository URL</Label>
                        <Input
                          id="repoUrl"
                          type="url"
                          placeholder="https://github.com/owner/repo"
                          value={repoUrl}
                          onChange={(e) => setRepoUrl(e.target.value)}
                          className="mt-1 block w-full"
                        />
                      </div>
                      <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? 'Analyzing...' : 'Analyze Repository'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
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
                  <RepositoryDetails repositoryData={repositoryData} />
                </motion.div>
              )}
            </TabsContent>
            <TabsContent value="starred">
              <motion.div variants={cardVariants}>
                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle>Top 10 Starred GitHub Repositories</CardTitle>
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
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function parseGitHubUrl(url: string) {
  const regex = /^https?:\/\/github.com\/([^/]+)\/([^/]+)/
  const match = url.match(regex)

  if (!match) {
    throw new Error('Invalid GitHub repository URL')
  }

  const [, owner, repo] = match
  return { owner, repo }
}