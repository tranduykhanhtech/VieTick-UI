import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserProfile, UserStats, SearchParams, SearchResults } from '../../types';
import { mockUsers } from '../../api/config';

interface UsersState {
  profiles: { [key: string]: UserProfile };
  searchResults: SearchResults<User> | null;
  recommendedUsers: User[];
  isLoading: boolean;
  error: string | null;
}

const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Async thunks
export const getUserProfileAsync = createAsyncThunk(
  'users/getUserProfile',
  async (userId: string) => {
    await mockDelay(500);
    
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      ...user,
      isFollowing: Math.random() > 0.5, // Mock follow status
      isFollower: Math.random() > 0.5,
      mutualFollows: Math.floor(Math.random() * 10),
    } as UserProfile;
  }
);

export const getUserByUsernameAsync = createAsyncThunk(
  'users/getUserByUsername',
  async (username: string) => {
    await mockDelay(500);
    
    const user = mockUsers.find(u => u.username === username);
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      ...user,
      isFollowing: Math.random() > 0.5,
      isFollower: Math.random() > 0.5,
      mutualFollows: Math.floor(Math.random() * 10),
    } as UserProfile;
  }
);

export const updateUserProfileAsync = createAsyncThunk(
  'users/updateProfile',
  async (updateData: Partial<User>) => {
    await mockDelay(1000);
    
    // Mock profile update
    const updatedUser = {
      ...mockUsers[0], // Assuming current user is first user
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    
    // Update localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return updatedUser;
  }
);

export const getUserStatsAsync = createAsyncThunk(
  'users/getUserStats',
  async (userId: string) => {
    await mockDelay(300);
    
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      postsCount: user.postsCount,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      likesReceived: Math.floor(Math.random() * 1000),
      commentsReceived: Math.floor(Math.random() * 500),
    } as UserStats;
  }
);

export const searchUsersAsync = createAsyncThunk(
  'users/searchUsers',
  async ({ query, page = 1, limit = 10 }: SearchParams) => {
    await mockDelay(500);
    
    const filteredUsers = mockUsers.filter(user =>
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(query.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(query.toLowerCase()) ||
      user.bio?.toLowerCase().includes(query.toLowerCase())
    );
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const results = filteredUsers.slice(startIndex, endIndex);
    
    return {
      results,
      total: filteredUsers.length,
      query,
    } as SearchResults<User>;
  }
);

export const getRecommendedUsersAsync = createAsyncThunk(
  'users/getRecommendedUsers',
  async () => {
    await mockDelay(500);
    
    // Mock recommended users logic
    const shuffled = [...mockUsers].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }
);

export const checkUsernameAvailabilityAsync = createAsyncThunk(
  'users/checkUsernameAvailability',
  async (username: string) => {
    await mockDelay(300);
    
    const isAvailable = !mockUsers.some(u => u.username === username);
    return { username, isAvailable };
  }
);

export const checkEmailAvailabilityAsync = createAsyncThunk(
  'users/checkEmailAvailability',
  async (email: string) => {
    await mockDelay(300);
    
    const isAvailable = !mockUsers.some(u => u.email === email);
    return { email, isAvailable };
  }
);

const initialState: UsersState = {
  profiles: {},
  searchResults: null,
  recommendedUsers: [],
  isLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserInProfiles: (state, action: PayloadAction<{ userId: string; updates: Partial<UserProfile> }>) => {
      const { userId, updates } = action.payload;
      if (state.profiles[userId]) {
        state.profiles[userId] = { ...state.profiles[userId], ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    // Get user profile
    builder
      .addCase(getUserProfileAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfileAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profiles[action.payload.id] = action.payload;
        state.error = null;
      })
      .addCase(getUserProfileAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch user profile';
      });

    // Get user by username
    builder
      .addCase(getUserByUsernameAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserByUsernameAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profiles[action.payload.id] = action.payload;
        state.error = null;
      })
      .addCase(getUserByUsernameAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch user profile';
      });

    // Update user profile
    builder
      .addCase(updateUserProfileAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfileAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profiles[action.payload.id] = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfileAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update profile';
      });

    // Search users
    builder
      .addCase(searchUsersAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchUsersAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(searchUsersAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Search failed';
      });

    // Get recommended users
    builder
      .addCase(getRecommendedUsersAsync.fulfilled, (state, action) => {
        state.recommendedUsers = action.payload;
      });
  },
});

export const { clearSearchResults, clearError, updateUserInProfiles } = usersSlice.actions;
export default usersSlice.reducer;
