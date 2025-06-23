import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, FollowStatus, FollowRelationship } from '../../types';
import { mockUsers } from '../../api/config';

interface FollowsState {
  followers: { [userId: string]: User[] };
  following: { [userId: string]: User[] };
  followStatus: { [userId: string]: FollowStatus };
  mutualFollows: { [userId: string]: User[] };
  isLoading: boolean;
  error: string | null;
}

const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock follow relationships
const mockFollowRelationships: FollowRelationship[] = [
  {
    id: '1',
    followerId: '1',
    followingId: '2',
    createdAt: '2024-06-01T10:00:00Z'
  },
  {
    id: '2',
    followerId: '2',
    followingId: '3',
    createdAt: '2024-06-02T11:00:00Z'
  },
  {
    id: '3',
    followerId: '3',
    followingId: '1',
    createdAt: '2024-06-03T12:00:00Z'
  },
  {
    id: '4',
    followerId: '1',
    followingId: '3',
    createdAt: '2024-06-04T13:00:00Z'
  }
];

// Async thunks
export const followUserAsync = createAsyncThunk(
  'follows/followUser',
  async (userId: string, { getState }) => {
    await mockDelay(500);
    
    const state = getState() as any;
    const currentUser = state.auth.user;
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    if (currentUser.id === userId) {
      throw new Error('Cannot follow yourself');
    }
    
    // Check if already following
    const existingRelationship = mockFollowRelationships.find(
      rel => rel.followerId === currentUser.id && rel.followingId === userId
    );
    
    if (existingRelationship) {
      throw new Error('Already following this user');
    }
    
    // Create new follow relationship
    const newRelationship: FollowRelationship = {
      id: Date.now().toString(),
      followerId: currentUser.id,
      followingId: userId,
      createdAt: new Date().toISOString(),
    };
    
    mockFollowRelationships.push(newRelationship);
    
    return { userId, isFollowing: true };
  }
);

export const unfollowUserAsync = createAsyncThunk(
  'follows/unfollowUser',
  async (userId: string, { getState }) => {
    await mockDelay(500);
    
    const state = getState() as any;
    const currentUser = state.auth.user;
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Find and remove the follow relationship
    const relationshipIndex = mockFollowRelationships.findIndex(
      rel => rel.followerId === currentUser.id && rel.followingId === userId
    );
    
    if (relationshipIndex === -1) {
      throw new Error('Not following this user');
    }
    
    mockFollowRelationships.splice(relationshipIndex, 1);
    
    return { userId, isFollowing: false };
  }
);

export const toggleFollowUserAsync = createAsyncThunk(
  'follows/toggleFollowUser',
  async (userId: string, { getState, dispatch }) => {
    const state = getState() as any;
    const currentUser = state.auth.user;
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Check current follow status
    const isCurrentlyFollowing = mockFollowRelationships.some(
      rel => rel.followerId === currentUser.id && rel.followingId === userId
    );
    
    if (isCurrentlyFollowing) {
      return dispatch(unfollowUserAsync(userId)).unwrap();
    } else {
      return dispatch(followUserAsync(userId)).unwrap();
    }
  }
);

export const getFollowStatusAsync = createAsyncThunk(
  'follows/getFollowStatus',
  async (userId: string, { getState }) => {
    await mockDelay(200);
    
    const state = getState() as any;
    const currentUser = state.auth.user;
    
    if (!currentUser) {
      return {
        userId,
        isFollowing: false,
        isFollower: false,
        isMutual: false,
      };
    }
    
    const isFollowing = mockFollowRelationships.some(
      rel => rel.followerId === currentUser.id && rel.followingId === userId
    );
    
    const isFollower = mockFollowRelationships.some(
      rel => rel.followerId === userId && rel.followingId === currentUser.id
    );
    
    return {
      userId,
      isFollowing,
      isFollower,
      isMutual: isFollowing && isFollower,
    };
  }
);

export const getUserFollowersAsync = createAsyncThunk(
  'follows/getUserFollowers',
  async (userId: string) => {
    await mockDelay(600);
    
    // Get follower IDs
    const followerIds = mockFollowRelationships
      .filter(rel => rel.followingId === userId)
      .map(rel => rel.followerId);
    
    // Get follower user objects
    const followers = mockUsers.filter(user => followerIds.includes(user.id));
    
    return { userId, followers };
  }
);

export const getUserFollowingAsync = createAsyncThunk(
  'follows/getUserFollowing',
  async (userId: string) => {
    await mockDelay(600);
    
    // Get following IDs
    const followingIds = mockFollowRelationships
      .filter(rel => rel.followerId === userId)
      .map(rel => rel.followingId);
    
    // Get following user objects
    const following = mockUsers.filter(user => followingIds.includes(user.id));
    
    return { userId, following };
  }
);

export const getMutualFollowsAsync = createAsyncThunk(
  'follows/getMutualFollows',
  async (userId: string, { getState }) => {
    await mockDelay(400);
    
    const state = getState() as any;
    const currentUser = state.auth.user;
    
    if (!currentUser) {
      return { userId, mutualFollows: [] };
    }
    
    // Get users that both current user and target user follow
    const currentUserFollowing = mockFollowRelationships
      .filter(rel => rel.followerId === currentUser.id)
      .map(rel => rel.followingId);
    
    const targetUserFollowing = mockFollowRelationships
      .filter(rel => rel.followerId === userId)
      .map(rel => rel.followingId);
    
    const mutualFollowIds = currentUserFollowing.filter(id => 
      targetUserFollowing.includes(id)
    );
    
    const mutualFollows = mockUsers.filter(user => 
      mutualFollowIds.includes(user.id)
    );
    
    return { userId, mutualFollows };
  }
);

export const getFollowCountsAsync = createAsyncThunk(
  'follows/getFollowCounts',
  async (userId: string) => {
    await mockDelay(300);
    
    const followersCount = mockFollowRelationships.filter(
      rel => rel.followingId === userId
    ).length;
    
    const followingCount = mockFollowRelationships.filter(
      rel => rel.followerId === userId
    ).length;
    
    return {
      userId,
      followersCount,
      followingCount,
    };
  }
);

export const bulkFollowUsersAsync = createAsyncThunk(
  'follows/bulkFollowUsers',
  async (userIds: string[], { getState, dispatch }) => {
    const results = [];
    
    for (const userId of userIds) {
      try {
        const result = await dispatch(followUserAsync(userId)).unwrap();
        results.push(result);
      } catch (error) {
        // Continue with other users even if one fails
        console.error(`Failed to follow user ${userId}:`, error);
      }
    }
    
    return results;
  }
);

export const bulkUnfollowUsersAsync = createAsyncThunk(
  'follows/bulkUnfollowUsers',
  async (userIds: string[], { getState, dispatch }) => {
    const results = [];
    
    for (const userId of userIds) {
      try {
        const result = await dispatch(unfollowUserAsync(userId)).unwrap();
        results.push(result);
      } catch (error) {
        // Continue with other users even if one fails
        console.error(`Failed to unfollow user ${userId}:`, error);
      }
    }
    
    return results;
  }
);

const initialState: FollowsState = {
  followers: {},
  following: {},
  followStatus: {},
  mutualFollows: {},
  isLoading: false,
  error: null,
};

const followsSlice = createSlice({
  name: 'follows',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearFollowData: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      delete state.followers[userId];
      delete state.following[userId];
      delete state.followStatus[userId];
      delete state.mutualFollows[userId];
    },
    updateFollowStatus: (state, action: PayloadAction<{ userId: string; status: Partial<FollowStatus> }>) => {
      const { userId, status } = action.payload;
      state.followStatus[userId] = {
        ...state.followStatus[userId],
        ...status,
      };
    },
  },
  extraReducers: (builder) => {
    // Follow user
    builder
      .addCase(followUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(followUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const { userId } = action.payload;
        
        // Update follow status
        state.followStatus[userId] = {
          ...state.followStatus[userId],
          isFollowing: true,
          isMutual: state.followStatus[userId]?.isFollower || false,
        };
        
        state.error = null;
      })
      .addCase(followUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to follow user';
      });

    // Unfollow user
    builder
      .addCase(unfollowUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unfollowUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const { userId } = action.payload;
        
        // Update follow status
        state.followStatus[userId] = {
          ...state.followStatus[userId],
          isFollowing: false,
          isMutual: false,
        };
        
        state.error = null;
      })
      .addCase(unfollowUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to unfollow user';
      });

    // Get follow status
    builder
      .addCase(getFollowStatusAsync.fulfilled, (state, action) => {
        const { userId, isFollowing, isFollower, isMutual } = action.payload;
        state.followStatus[userId] = {
          isFollowing,
          isFollower,
          isMutual,
        };
      });

    // Get user followers
    builder
      .addCase(getUserFollowersAsync.fulfilled, (state, action) => {
        const { userId, followers } = action.payload;
        state.followers[userId] = followers;
      });

    // Get user following
    builder
      .addCase(getUserFollowingAsync.fulfilled, (state, action) => {
        const { userId, following } = action.payload;
        state.following[userId] = following;
      });

    // Get mutual follows
    builder
      .addCase(getMutualFollowsAsync.fulfilled, (state, action) => {
        const { userId, mutualFollows } = action.payload;
        state.mutualFollows[userId] = mutualFollows;
      });
  },
});

export const { clearError, clearFollowData, updateFollowStatus } = followsSlice.actions;
export default followsSlice.reducer;
