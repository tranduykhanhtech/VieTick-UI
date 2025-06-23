import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Image, Smile, MapPin, Calendar, Send } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { createPostAsync } from '../../store/slices/postsSlice'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import LoadingSpinner from '../Common/LoadingSpinner'
import toast from 'react-hot-toast'

const postSchema = z.object({
  content: z
    .string()
    .min(1, 'Post content cannot be empty')
    .max(280, 'Post content must be less than 280 characters'),
})

type PostFormData = z.infer<typeof postSchema>

const PostCreator = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { isCreating } = useAppSelector((state) => state.posts)
  const [charCount, setCharCount] = useState(0)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: '',
    },
  })

  const content = watch('content')

  // Update character count when content changes
  useEffect(() => {
    setCharCount(content?.length || 0)
  }, [content])

  const onSubmit = async (data: PostFormData) => {
    try {
      await dispatch(createPostAsync({ content: data.content })).unwrap()
      reset()
      setCharCount(0)
      toast.success('Post created successfully!')
    } catch (error) {
      toast.error('Failed to create post')
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* User Avatar and Input */}
          <div className="flex space-x-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={user?.avatar} alt={user?.username} />
              <AvatarFallback>
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <Textarea
                placeholder="What's happening?"
                className="min-h-[100px] resize-none border-none bg-transparent text-lg placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                {...register('content')}
              />
              
              {errors.content && (
                <p className="text-sm text-destructive mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>
          </div>

          {/* Character Count and Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center space-x-1">
              {/* Media Upload Buttons */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                disabled
              >
                <Image className="h-4 w-4" />
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                disabled
              >
                <Smile className="h-4 w-4" />
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                disabled
              >
                <MapPin className="h-4 w-4" />
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                disabled
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-3">
              {/* Character Counter */}
              <div className="text-sm text-muted-foreground">
                <span className={charCount > 280 ? 'text-destructive' : ''}>
                  {charCount}
                </span>
                <span>/280</span>
              </div>

              {/* Post Button */}
              <Button
                type="submit"
                disabled={isCreating || charCount === 0 || charCount > 280}
                size="sm"
              >
                {isCreating ? (
                  <>
                    <LoadingSpinner size="small" className="mr-2" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default PostCreator
