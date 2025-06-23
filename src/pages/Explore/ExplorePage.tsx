import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { getExplorePostsAsync } from '../../store/slices/postsSlice'
import PostCard from '../../components/Posts/PostCard'
import LoadingSpinner from '../../components/Common/LoadingSpinner'
import { Alert, AlertDescription } from '../../components/ui/alert'

const ExplorePage = () => {
  const dispatch = useAppDispatch()
  const { explorePosts, isLoading, error } = useAppSelector((state) => state.posts)

  useEffect(() => {
    dispatch(getExplorePostsAsync({}))
  }, [dispatch])

  if (isLoading && explorePosts.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Explore</h1>
        <p className="text-muted-foreground">
          Discover trending posts and popular content from the community
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Posts */}
      <div className="space-y-4">
        {explorePosts.length === 0 && !isLoading ? (
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No posts to explore
            </h3>
            <p className="text-muted-foreground">
              Check back later for new content from the community.
            </p>
          </div>
        ) : (
          explorePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

      {/* Loading More */}
      {isLoading && explorePosts.length > 0 && (
        <div className="flex justify-center py-4">
          <LoadingSpinner size="medium" />
        </div>
      )}
    </div>
  )
}

export default ExplorePage
