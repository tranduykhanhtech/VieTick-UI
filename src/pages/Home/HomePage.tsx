import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { getFeedAsync } from '../../store/slices/postsSlice'
import PostCreator from '../../components/Posts/PostCreator'
import PostCard from '../../components/Posts/PostCard'
import LoadingSpinner from '../../components/Common/LoadingSpinner'
import { Alert, AlertDescription } from '../../components/ui/alert'

const HomePage = () => {
  const dispatch = useAppDispatch()
  const { feed, isLoading, error } = useAppSelector((state) => state.posts)
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getFeedAsync({}))
  }, [dispatch])

  if (isLoading && feed.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-6 border border-border">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Welcome back, {user?.firstName || user?.username}! 👋
        </h1>
        <p className="text-muted-foreground">
          What's on your mind today? Share your thoughts with your followers.
        </p>
      </div>

      {/* Post Creator */}
      <PostCreator />

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Feed */}
      <div className="space-y-4">
        {feed.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1.586l-4.414 4.414z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Your feed is empty
            </h3>
            <p className="text-muted-foreground mb-4">
              Follow some users or check out the explore page to discover new content.
            </p>
            <div className="space-x-2">
              <a
                href="/explore"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Explore Posts
              </a>
              <a
                href="/search"
                className="inline-flex items-center px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                Find Users
              </a>
            </div>
          </div>
        ) : (
          feed.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

      {/* Loading More */}
      {isLoading && feed.length > 0 && (
        <div className="flex justify-center py-4">
          <LoadingSpinner size="medium" />
        </div>
      )}
    </div>
  )
}

export default HomePage
