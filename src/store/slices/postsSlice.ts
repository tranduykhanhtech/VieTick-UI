import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Post, CreatePostData, PostStats, SearchParams, SearchResults } from '../../types';
import { mockPosts, mockUsers } from '../../api/config';

interface PostsState {
  feed: Post[];
  explorePosts: Post[];
  userPosts: { [userId: string]: Post[] };
  currentPost: Post | null;
  searchResults: SearchResults<Post> | null;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  pagination: {
    hasNextPage: boolean;
    nextCursor: string | null;
  };
}

const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate additional mock posts for demonstration
const generateMockPosts = (): Post[] => {
  const additionalPosts: Post[] = [
    {
      id: '4',
      content: 'Beautiful sunset at the beach today! Sometimes you need to step away from the code and enjoy nature 🌅',
      authorId: '1',
      author: mockUsers[0],
      likesCount: 23,
      commentsCount: 4,
      isLiked: true,
      createdAt: '2024-06-22T18:30:00Z',
      updatedAt: '2024-06-22T18:30:00Z'
    },
    {
      id: '5',
      content: 'Pro tip: Use CSS Grid for complex layouts and Flexbox for component-level alignment. They work beautifully together! 💡',
      authorId: '2',
      author: mockUsers[1],
      likesCount: 56,
      commentsCount: 9,
      isLiked: false,
      createdAt: '2024-06-22T15:20:00Z',
      updatedAt: '2024-06-22T15:20:00Z'
    },
    {
      id: '6',
      content: 'Just launched my first npm package! It\'s a small utility for handling date formatting, but I\'m proud of it. Every journey starts with a single step 🚀',
      authorId: '3',
      author: mockUsers[2],
      likesCount: 78,
      commentsCount: 16,
      isLiked: true,
      createdAt: '2024-06-22T12:10:00Z',
      updatedAt: '2024-06-22T12:10:00Z'
    }
  ];
  
  return [...mockPosts, ...additionalPosts];
};

const allMockPosts = generateMockPosts();

// Async thunks
export const getFeedAsync = createAsyncThunk(
  'posts/getFeed',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    await mockDelay(800);
    
    // Mock feed logic - sort by creation date
    const sortedPosts = [...allMockPosts].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const posts = sortedPosts.slice(startIndex, endIndex);
    
    return {
      posts,
      hasNextPage: endIndex < sortedPosts.length,
      nextCursor: endIndex < sortedPosts.length ? endIndex.toString() : null,
    };
  }
);

export const getExplorePostsAsync = createAsyncThunk(
  'posts/getExplorePosts',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    await mockDelay(600);
    
    // Mock explore logic - sort by likes
    const sortedPosts = [...allMockPosts].sort((a, b) => b.likesCount - a.likesCount);
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const posts = sortedPosts.slice(startIndex, endIndex);
    
    return {
      posts,
      hasNextPage: endIndex < sortedPosts.length,
      nextCursor: endIndex < sortedPosts.length ? endIndex.toString() : null,
    };
  }
);

export const getUserPostsAsync = createAsyncThunk(
  'posts/getUserPosts',
  async ({ userId, page = 1, limit = 10 }: { userId: string; page?: number; limit?: number }) => {
    await mockDelay(500);
    
    const userPosts = allMockPosts.filter(post => post.authorId === userId);
    const sortedPosts = userPosts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const posts = sortedPosts.slice(startIndex, endIndex);
    
    return { userId, posts };
  }
);

export const getPostByIdAsync = createAsyncThunk(
  'posts/getPostById',
  async (postId: string) => {
    await mockDelay(300);
    
    const post = allMockPosts.find(p => p.id === postId);
    if (!post) {
      throw new Error('Post not found');
    }
    
    return post;
  }
);

export const createPostAsync = createAsyncThunk(
  'posts/createPost',
  async (postData: CreatePostData, { getState }) => {
    await mockDelay(1000);
    
    const state = getState() as any;
    const currentUser = state.auth.user;
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    const newPost: Post = {
      id: Date.now().toString(),
      content: postData.content,
      authorId: currentUser.id,
      author: currentUser,
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add to mock data
    allMockPosts.unshift(newPost);
    
    return newPost;
  }
);

export const updatePostAsync = createAsyncThunk(
  'posts/updatePost',
  async ({ postId, content }: { postId: string; content: string }) => {
    await mockDelay(800);
    
    const postIndex = allMockPosts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }
    
    const updatedPost = {
      ...allMockPosts[postIndex],
      content,
      updatedAt: new Date().toISOString(),
    };
    
    allMockPosts[postIndex] = updatedPost;
    
    return updatedPost;
  }
);

export const deletePostAsync = createAsyncThunk(
  'posts/deletePost',
  async (postId: string) => {
    await mockDelay(500);
    
    const postIndex = allMockPosts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }
    
    allMockPosts.splice(postIndex, 1);
    
    return postId;
  }
);

export const toggleLikePostAsync = createAsyncThunk(
  'posts/toggleLikePost',
  async (postId: string) => {
    await mockDelay(200);
    
    const postIndex = allMockPosts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }
    
    const post = allMockPosts[postIndex];
    const newIsLiked = !post.isLiked;
    const newLikesCount = newIsLiked ? post.likesCount + 1 : post.likesCount - 1;
    
    const updatedPost = {
      ...post,
      isLiked: newIsLiked,
      likesCount: Math.max(0, newLikesCount),
    };
    
    allMockPosts[postIndex] = updatedPost;
    
    return updatedPost;
  }
);

export const searchPostsAsync = createAsyncThunk(
  'posts/searchPosts',
  async ({ query, page = 1, limit = 10 }: SearchParams) => {
    await mockDelay(500);
    
    const filteredPosts = allMockPosts.filter(post =>
      post.content.toLowerCase().includes(query.toLowerCase()) ||
      post.author.username.toLowerCase().includes(query.toLowerCase()) ||
      post.author.firstName?.toLowerCase().includes(query.toLowerCase()) ||
      post.author.lastName?.toLowerCase().includes(query.toLowerCase())
    );
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const results = filteredPosts.slice(startIndex, endIndex);
    
    return {
      results,
      total: filteredPosts.length,
      query,
    } as SearchResults<Post>;
  }
);

export const getPostStatsAsync = createAsyncThunk(
  'posts/getPostStats',
  async (postId: string) => {
    await mockDelay(300);
    
    const post = allMockPosts.find(p => p.id === postId);
    if (!post) {
      throw new Error('Post not found');
    }
    
    return {
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      sharesCount: Math.floor(Math.random() * 20),
    } as PostStats;
  }
);

const initialState: PostsState = {
  feed: [],
  explorePosts: [],
  userPosts: {},
  currentPost: null,
  searchResults: null,
  isLoading: false,
  isCreating: false,
  error: null,
  pagination: {
    hasNextPage: false,
    nextCursor: null,
  },
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    updatePostInState: (state, action: PayloadAction<Post>) => {
      const updatedPost = action.payload;
      
      // Update in feed
      const feedIndex = state.feed.findIndex(p => p.id === updatedPost.id);
      if (feedIndex !== -1) {
        state.feed[feedIndex] = updatedPost;
      }
      
      // Update in explore posts
      const exploreIndex = state.explorePosts.findIndex(p => p.id === updatedPost.id);
      if (exploreIndex !== -1) {
        state.explorePosts[exploreIndex] = updatedPost;
      }
      
      // Update in user posts
      const userId = updatedPost.authorId;
      if (state.userPosts[userId]) {
        const userPostIndex = state.userPosts[userId].findIndex(p => p.id === updatedPost.id);
        if (userPostIndex !== -1) {
          state.userPosts[userId][userPostIndex] = updatedPost;
        }
      }
      
      // Update current post
      if (state.currentPost?.id === updatedPost.id) {
        state.currentPost = updatedPost;
      }
    },
  },
  extraReducers: (builder) => {
    // Get feed
    builder
      .addCase(getFeedAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeedAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feed = action.payload.posts;
        state.pagination.hasNextPage = action.payload.hasNextPage;
        state.pagination.nextCursor = action.payload.nextCursor;
        state.error = null;
      })
      .addCase(getFeedAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch feed';
      });

    // Get explore posts
    builder
      .addCase(getExplorePostsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getExplorePostsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.explorePosts = action.payload.posts;
        state.error = null;
      })
      .addCase(getExplorePostsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch explore posts';
      });

    // Get user posts
    builder
      .addCase(getUserPostsAsync.fulfilled, (state, action) => {
        state.userPosts[action.payload.userId] = action.payload.posts;
      });

    // Get post by ID
    builder
      .addCase(getPostByIdAsync.fulfilled, (state, action) => {
        state.currentPost = action.payload;
      });

    // Create post
    builder
      .addCase(createPostAsync.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createPostAsync.fulfilled, (state, action) => {
        state.isCreating = false;
        state.feed.unshift(action.payload);
        state.error = null;
      })
      .addCase(createPostAsync.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.error.message || 'Failed to create post';
      });

    // Update post
    builder
      .addCase(updatePostAsync.fulfilled, (state, action) => {
        postsSlice.caseReducers.updatePostInState(state, action);
      });

    // Delete post
    builder
      .addCase(deletePostAsync.fulfilled, (state, action) => {
        const postId = action.payload;
        
        // Remove from feed
        state.feed = state.feed.filter(p => p.id !== postId);
        
        // Remove from explore posts
        state.explorePosts = state.explorePosts.filter(p => p.id !== postId);
        
        // Remove from user posts
        Object.keys(state.userPosts).forEach(userId => {
          state.userPosts[userId] = state.userPosts[userId].filter(p => p.id !== postId);
        });
        
        // Clear current post if it's the deleted one
        if (state.currentPost?.id === postId) {
          state.currentPost = null;
        }
      });

    // Toggle like post
    builder
      .addCase(toggleLikePostAsync.fulfilled, (state, action) => {
        postsSlice.caseReducers.updatePostInState(state, action);
      });

    // Search posts
    builder
      .addCase(searchPostsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchPostsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(searchPostsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Search failed';
      });
  },
});

export const { clearError, clearSearchResults, clearCurrentPost, updatePostInState } = postsSlice.actions;
export default postsSlice.reducer;
