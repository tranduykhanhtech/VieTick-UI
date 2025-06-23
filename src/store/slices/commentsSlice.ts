import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Comment, CreateCommentData } from '../../types';
import { mockComments, mockUsers } from '../../api/config';

interface CommentsState {
  comments: { [postId: string]: Comment[] };
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
}

const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Extended mock comments data
const allMockComments: Comment[] = [
  ...mockComments,
  {
    id: '3',
    content: 'This is exactly what our team needed! Thanks for sharing.',
    postId: '1',
    authorId: '3',
    author: mockUsers[2],
    likesCount: 2,
    isLiked: false,
    createdAt: '2024-06-23T15:00:00Z',
    updatedAt: '2024-06-23T15:00:00Z'
  },
  {
    id: '4',
    content: 'Great point about balance. I always struggle with finding the right amount of detail vs simplicity.',
    postId: '2',
    authorId: '1',
    author: mockUsers[0],
    likesCount: 1,
    isLiked: true,
    createdAt: '2024-06-23T11:45:00Z',
    updatedAt: '2024-06-23T11:45:00Z'
  },
  {
    id: '5',
    content: 'Would love to see your package! Do you have a GitHub link?',
    postId: '3',
    authorId: '2',
    author: mockUsers[1],
    likesCount: 4,
    isLiked: false,
    createdAt: '2024-06-23T10:15:00Z',
    updatedAt: '2024-06-23T10:15:00Z'
  }
];

// Async thunks
export const getPostCommentsAsync = createAsyncThunk(
  'comments/getPostComments',
  async (postId: string) => {
    await mockDelay(500);
    
    const postComments = allMockComments.filter(comment => comment.postId === postId);
    
    // Sort comments by creation date (newest first)
    const sortedComments = postComments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return { postId, comments: sortedComments };
  }
);

export const createCommentAsync = createAsyncThunk(
  'comments/createComment',
  async (commentData: CreateCommentData, { getState }) => {
    await mockDelay(800);
    
    const state = getState() as any;
    const currentUser = state.auth.user;
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    const newComment: Comment = {
      id: Date.now().toString(),
      content: commentData.content,
      postId: commentData.postId,
      authorId: currentUser.id,
      author: currentUser,
      parentId: commentData.parentId,
      likesCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add to mock data
    allMockComments.push(newComment);
    
    return newComment;
  }
);

export const updateCommentAsync = createAsyncThunk(
  'comments/updateComment',
  async ({ commentId, content }: { commentId: string; content: string }) => {
    await mockDelay(600);
    
    const commentIndex = allMockComments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }
    
    const updatedComment = {
      ...allMockComments[commentIndex],
      content,
      updatedAt: new Date().toISOString(),
    };
    
    allMockComments[commentIndex] = updatedComment;
    
    return updatedComment;
  }
);

export const deleteCommentAsync = createAsyncThunk(
  'comments/deleteComment',
  async (commentId: string) => {
    await mockDelay(400);
    
    const commentIndex = allMockComments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }
    
    const comment = allMockComments[commentIndex];
    allMockComments.splice(commentIndex, 1);
    
    return { commentId, postId: comment.postId };
  }
);

export const toggleLikeCommentAsync = createAsyncThunk(
  'comments/toggleLikeComment',
  async (commentId: string) => {
    await mockDelay(200);
    
    const commentIndex = allMockComments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }
    
    const comment = allMockComments[commentIndex];
    const newIsLiked = !comment.isLiked;
    const newLikesCount = newIsLiked ? comment.likesCount + 1 : comment.likesCount - 1;
    
    const updatedComment = {
      ...comment,
      isLiked: newIsLiked,
      likesCount: Math.max(0, newLikesCount),
    };
    
    allMockComments[commentIndex] = updatedComment;
    
    return updatedComment;
  }
);

export const getCommentByIdAsync = createAsyncThunk(
  'comments/getCommentById',
  async (commentId: string) => {
    await mockDelay(300);
    
    const comment = allMockComments.find(c => c.id === commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }
    
    return comment;
  }
);

const initialState: CommentsState = {
  comments: {},
  isLoading: false,
  isCreating: false,
  error: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCommentsForPost: (state, action: PayloadAction<string>) => {
      delete state.comments[action.payload];
    },
    updateCommentInState: (state, action: PayloadAction<Comment>) => {
      const updatedComment = action.payload;
      const postId = updatedComment.postId;
      
      if (state.comments[postId]) {
        const commentIndex = state.comments[postId].findIndex(c => c.id === updatedComment.id);
        if (commentIndex !== -1) {
          state.comments[postId][commentIndex] = updatedComment;
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Get post comments
    builder
      .addCase(getPostCommentsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPostCommentsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments[action.payload.postId] = action.payload.comments;
        state.error = null;
      })
      .addCase(getPostCommentsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch comments';
      });

    // Create comment
    builder
      .addCase(createCommentAsync.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createCommentAsync.fulfilled, (state, action) => {
        state.isCreating = false;
        const comment = action.payload;
        const postId = comment.postId;
        
        if (!state.comments[postId]) {
          state.comments[postId] = [];
        }
        
        // Add comment to the beginning of the array (newest first)
        state.comments[postId].unshift(comment);
        state.error = null;
      })
      .addCase(createCommentAsync.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.error.message || 'Failed to create comment';
      });

    // Update comment
    builder
      .addCase(updateCommentAsync.fulfilled, (state, action) => {
        commentsSlice.caseReducers.updateCommentInState(state, action);
      });

    // Delete comment
    builder
      .addCase(deleteCommentAsync.fulfilled, (state, action) => {
        const { commentId, postId } = action.payload;
        
        if (state.comments[postId]) {
          state.comments[postId] = state.comments[postId].filter(c => c.id !== commentId);
        }
      });

    // Toggle like comment
    builder
      .addCase(toggleLikeCommentAsync.fulfilled, (state, action) => {
        commentsSlice.caseReducers.updateCommentInState(state, action);
      });
  },
});

export const { clearError, clearCommentsForPost, updateCommentInState } = commentsSlice.actions;
export default commentsSlice.reducer;
