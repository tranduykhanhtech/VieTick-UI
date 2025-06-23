import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  Edit,
  Trash2,
  Flag
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { toggleLikePostAsync, deletePostAsync } from '../../store/slices/postsSlice'
import { Post } from '../../types'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'
import LoadingSpinner from '../Common/LoadingSpinner'
import toast from 'react-hot-toast'

interface PostCardProps {
  post: Post
}

const PostCard = ({ post }: PostCardProps) => {
  const dispatch = useAppDispatch()
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const [isLiking, setIsLiking] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const isOwner = currentUser?.id === post.authorId
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })

  const handleLike = async () => {
    setIsLiking(true)
    try {
      await dispatch(toggleLikePostAsync(post.id)).unwrap()
    } catch (error) {
      toast.error('Failed to update like')
    } finally {
      setIsLiking(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await dispatch(deletePostAsync(post.id)).unwrap()
      toast.success('Post deleted successfully')
      setShowDeleteDialog(false)
    } catch (error) {
      toast.error('Failed to delete post')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${post.author.username}`,
          text: post.content,
          url: `/post/${post.id}`,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`)
        toast.success('Link copied to clipboard!')
      } catch (error) {
        toast.error('Failed to copy link')
      }
    }
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          {/* Post Header */}
          <div className="flex items-start space-x-3 mb-3">
            <Link to={`/profile/${post.author.username}`}>
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar} alt={post.author.username} />
                <AvatarFallback>
                  {post.author.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <Link 
                  to={`/profile/${post.author.username}`}
                  className="font-semibold text-foreground hover:underline"
                >
                  {post.author.firstName && post.author.lastName 
                    ? `${post.author.firstName} ${post.author.lastName}`
                    : post.author.username
                  }
                </Link>
                
                {post.author.isVerified && (
                  <Badge variant="secondary" className="px-1 py-0 text-xs">
                    ✓
                  </Badge>
                )}
                
                <span className="text-muted-foreground">•</span>
                
                <Link 
                  to={`/post/${post.id}`}
                  className="text-sm text-muted-foreground hover:underline"
                >
                  {timeAgo}
                </Link>
              </div>
              
              <p className="text-sm text-muted-foreground">
                @{post.author.username}
              </p>
            </div>

            {/* More Options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isOwner ? (
                  <>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit post
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete post
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem>
                      <Flag className="mr-2 h-4 w-4" />
                      Report post
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Post Content */}
          <div className="mb-4">
            <Link to={`/post/${post.id}`}>
              <p className="text-foreground whitespace-pre-wrap leading-relaxed hover:text-foreground/80 transition-colors">
                {post.content}
              </p>
            </Link>
          </div>

          {/* Post Actions */}
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center space-x-6">
              {/* Like Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isLiking}
                className={`p-2 h-auto ${post.isLiked ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'}`}
              >
                {isLiking ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <Heart 
                    className={`h-4 w-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} 
                  />
                )}
                <span className="text-sm">{post.likesCount}</span>
              </Button>

              {/* Comment Button */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="p-2 h-auto hover:text-blue-500"
              >
                <Link to={`/post/${post.id}`}>
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">{post.commentsCount}</span>
                </Link>
              </Button>

              {/* Share Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="p-2 h-auto hover:text-green-500"
              >
                <Share className="h-4 w-4 mr-1" />
                <span className="text-sm">Share</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default PostCard
