import { useEffect, useState } from 'react'
import { UserPlus, UserMinus } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { 
  getFollowStatusAsync, 
  toggleFollowUserAsync 
} from '../../store/slices/followsSlice'
import { Button } from '../ui/button'
import LoadingSpinner from '../Common/LoadingSpinner'

interface FollowButtonProps {
  userId: string
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  className?: string
}

const FollowButton = ({ 
  userId, 
  size = 'default', 
  variant = 'default',
  className 
}: FollowButtonProps) => {
  const dispatch = useAppDispatch()
  const { followStatus, isLoading } = useAppSelector((state) => state.follows)
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const [isProcessing, setIsProcessing] = useState(false)

  const userFollowStatus = followStatus[userId]
  const isFollowing = userFollowStatus?.isFollowing || false

  useEffect(() => {
    // Don't fetch follow status for current user
    if (userId !== currentUser?.id && !userFollowStatus) {
      dispatch(getFollowStatusAsync(userId))
    }
  }, [dispatch, userId, currentUser?.id, userFollowStatus])

  const handleToggleFollow = async () => {
    if (userId === currentUser?.id) return

    setIsProcessing(true)
    try {
      await dispatch(toggleFollowUserAsync(userId)).unwrap()
    } catch (error) {
      console.error('Failed to toggle follow:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Don't show follow button for current user
  if (userId === currentUser?.id) {
    return null
  }

  const loading = isLoading || isProcessing

  return (
    <Button
      onClick={handleToggleFollow}
      disabled={loading}
      size={size}
      variant={isFollowing ? 'outline' : variant}
      className={className}
    >
      {loading ? (
        <LoadingSpinner size="small" className="mr-2" />
      ) : (
        <>
          {isFollowing ? (
            <UserMinus className="w-4 h-4 mr-2" />
          ) : (
            <UserPlus className="w-4 h-4 mr-2" />
          )}
        </>
      )}
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  )
}

export default FollowButton
