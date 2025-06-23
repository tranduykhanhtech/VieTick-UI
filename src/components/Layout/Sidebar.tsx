import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Compass, 
  Search, 
  Bell, 
  User, 
  Settings,
  TrendingUp,
  BookmarkIcon,
  Heart,
  MessageCircle
} from 'lucide-react'
import { useAppSelector } from '../../hooks/redux'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

const Sidebar = () => {
  const location = useLocation()
  const { user } = useAppSelector((state) => state.auth)

  const navigation = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      current: location.pathname === '/'
    },
    {
      name: 'Explore',
      href: '/explore',
      icon: Compass,
      current: location.pathname === '/explore'
    },
    {
      name: 'Search',
      href: '/search',
      icon: Search,
      current: location.pathname === '/search'
    },
    {
      name: 'Notifications',
      href: '/notifications',
      icon: Bell,
      current: location.pathname === '/notifications',
      badge: true
    },
    {
      name: 'Profile',
      href: `/profile/${user?.username}`,
      icon: User,
      current: location.pathname === `/profile/${user?.username}`
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      current: location.pathname === '/settings'
    }
  ]

  const quickStats = [
    {
      label: 'Posts',
      value: user?.postsCount || 0,
      icon: MessageCircle
    },
    {
      label: 'Followers',
      value: user?.followersCount || 0,
      icon: Heart
    },
    {
      label: 'Following',
      value: user?.followingCount || 0,
      icon: TrendingUp
    }
  ]

  return (
    <div className="flex flex-col h-full p-4">
      {/* Navigation */}
      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors relative',
                item.current
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
              {item.badge && (
                <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Stats */}
      <div className="mt-8 pt-6 border-t border-border">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Your Stats
        </h3>
        <div className="space-y-3">
          {quickStats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="flex items-center text-sm">
                <Icon className="mr-3 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{stat.label}</span>
                <span className="ml-auto font-medium">{stat.value}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 pt-6 border-t border-border">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            asChild
          >
            <Link to="/bookmarks">
              <BookmarkIcon className="mr-2 h-4 w-4" />
              Saved Posts
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            asChild
          >
            <Link to="/trending">
              <TrendingUp className="mr-2 h-4 w-4" />
              Trending
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-border">
        <div className="text-xs text-muted-foreground space-y-1">
          <p>&copy; 2024 SocialSpace</p>
          <div className="flex space-x-2">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-foreground">Terms</a>
            <span>•</span>
            <a href="#" className="hover:text-foreground">Help</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
