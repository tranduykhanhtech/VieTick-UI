import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Users, Hash, ArrowRight } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { getRecommendedUsersAsync } from '../../store/slices/usersSlice'
import { getVerifiedUsersAsync } from '../../store/slices/verificationSlice'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'
import FollowButton from '../Users/FollowButton'
import LoadingSpinner from '../Common/LoadingSpinner'

const RightSidebar = () => {
  const dispatch = useAppDispatch()
  const { recommendedUsers } = useAppSelector((state) => state.users)
  const { verifiedUsers } = useAppSelector((state) => state.verification)

  useEffect(() => {
    dispatch(getRecommendedUsersAsync())
    dispatch(getVerifiedUsersAsync({ limit: 3 }))
  }, [dispatch])

  // Mock trending topics
  const trendingTopics = [
    { tag: 'React', posts: 1234 },
    { tag: 'TypeScript', posts: 892 },
    { tag: 'WebDev', posts: 756 },
    { tag: 'JavaScript', posts: 623 },
    { tag: 'TailwindCSS', posts: 445 }
  ]

  return (
    <div className="flex flex-col h-full p-4 space-y-6">
      {/* Trending Topics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <Link
                key={topic.tag}
                to={`/search?q=${encodeURIComponent(`#${topic.tag}`)}`}
                className="block p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground">#{index + 1}</span>
                      <Hash className="ml-2 mr-1 h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{topic.tag}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {topic.posts.toLocaleString()} posts
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="w-full mt-3" asChild>
            <Link to="/trending">
              Show more
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Suggested Users */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Users className="mr-2 h-5 w-5" />
            People to Follow
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recommendedUsers.length === 0 ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner size="small" />
            </div>
          ) : (
            <div className="space-y-3">
              {recommendedUsers.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center space-x-3">
                  <Link to={`/profile/${user.username}`}>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/profile/${user.username}`}
                      className="block"
                    >
                      <div className="flex items-center">
                        <p className="text-sm font-medium truncate">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : user.username
                          }
                        </p>
                        {user.isVerified && (
                          <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
                            ✓
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        @{user.username}
                      </p>
                    </Link>
                  </div>
                  <FollowButton userId={user.id} size="sm" />
                </div>
              ))}
            </div>
          )}
          <Button variant="ghost" size="sm" className="w-full mt-3" asChild>
            <Link to="/explore">
              Discover more
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Verified Users */}
      {verifiedUsers.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Badge variant="secondary" className="mr-2">✓</Badge>
              Verified Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {verifiedUsers.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center space-x-3">
                  <Link to={`/profile/${user.username}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/profile/${user.username}`}
                      className="block"
                    >
                      <div className="flex items-center">
                        <p className="text-sm font-medium truncate">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : user.username
                          }
                        </p>
                        <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
                          ✓
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        @{user.username} • {user.followersCount} followers
                      </p>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* App Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-sm">Welcome to SocialSpace</h3>
            <p className="text-xs text-muted-foreground">
              Connect with friends and share your thoughts with the world.
            </p>
            <div className="flex justify-center space-x-4 text-xs text-muted-foreground pt-2">
              <a href="#" className="hover:text-foreground">About</a>
              <a href="#" className="hover:text-foreground">Help</a>
              <a href="#" className="hover:text-foreground">Terms</a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RightSidebar
