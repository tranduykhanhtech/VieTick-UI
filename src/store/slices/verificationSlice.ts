import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { VerificationStatus, VerificationRequirements, User } from '../../types';

interface VerificationState {
  status: VerificationStatus | null;
  requirements: VerificationRequirements | null;
  verifiedUsers: User[];
  canSubmit: boolean;
  isLoading: boolean;
  error: string | null;
}

const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock verification requirements
const mockRequirements: VerificationRequirements = {
  minFollowers: 100,
  minPosts: 10,
  accountAge: 30, // days
  hasProfilePicture: true,
  hasBio: true,
};

// Async thunks
export const submitVerificationAsync = createAsyncThunk(
  'verification/submitVerification',
  async (verificationData: { idDocument: File; selfie: File }, { getState }) => {
    await mockDelay(2000);
    
    const state = getState() as any;
    const currentUser = state.auth.user;
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Mock verification submission
    const newStatus: VerificationStatus = {
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    
    return newStatus;
  }
);

export const getVerificationStatusAsync = createAsyncThunk(
  'verification/getVerificationStatus',
  async (_, { getState }) => {
    await mockDelay(500);
    
    const state = getState() as any;
    const currentUser = state.auth.user;
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Mock verification status based on user verification flag
    let status: VerificationStatus;
    
    if (currentUser.isVerified) {
      status = {
        status: 'approved',
        submittedAt: '2024-06-01T10:00:00Z',
        reviewedAt: '2024-06-05T14:30:00Z',
      };
    } else {
      // Random status for demo
      const randomStatus = Math.random();
      if (randomStatus < 0.3) {
        status = {
          status: 'pending',
          submittedAt: '2024-06-20T08:00:00Z',
        };
      } else if (randomStatus < 0.6) {
        status = {
          status: 'rejected',
          submittedAt: '2024-06-15T12:00:00Z',
          reviewedAt: '2024-06-18T16:45:00Z',
          reason: 'Insufficient documentation provided. Please submit clear, valid government-issued ID.',
        };
      } else {
        status = {
          status: 'not_submitted',
        };
      }
    }
    
    return status;
  }
);

export const checkCanSubmitVerificationAsync = createAsyncThunk(
  'verification/checkCanSubmitVerification',
  async (_, { getState }) => {
    await mockDelay(300);
    
    const state = getState() as any;
    const currentUser = state.auth.user;
    
    if (!currentUser) {
      return false;
    }
    
    // Check requirements
    const accountAge = Math.floor(
      (new Date().getTime() - new Date(currentUser.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    const meetsRequirements = 
      currentUser.followersCount >= mockRequirements.minFollowers &&
      currentUser.postsCount >= mockRequirements.minPosts &&
      accountAge >= mockRequirements.accountAge &&
      (mockRequirements.hasProfilePicture ? !!currentUser.avatar : true) &&
      (mockRequirements.hasBio ? !!currentUser.bio : true);
    
    return meetsRequirements;
  }
);

export const getVerificationRequirementsAsync = createAsyncThunk(
  'verification/getVerificationRequirements',
  async () => {
    await mockDelay(200);
    return mockRequirements;
  }
);

export const getVerifiedUsersAsync = createAsyncThunk(
  'verification/getVerifiedUsers',
  async ({ page = 1, limit = 20 }: { page?: number; limit?: number } = {}) => {
    await mockDelay(600);
    
    // Import mock users here to avoid circular dependency
    const { mockUsers } = await import('../../api/config');
    
    // Filter verified users
    const verifiedUsers = mockUsers.filter(user => user.isVerified);
    
    // Paginate results
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = verifiedUsers.slice(startIndex, endIndex);
    
    return paginatedUsers;
  }
);

const initialState: VerificationState = {
  status: null,
  requirements: null,
  verifiedUsers: [],
  canSubmit: false,
  isLoading: false,
  error: null,
};

const verificationSlice = createSlice({
  name: 'verification',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetVerificationStatus: (state) => {
      state.status = null;
      state.canSubmit = false;
    },
  },
  extraReducers: (builder) => {
    // Submit verification
    builder
      .addCase(submitVerificationAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitVerificationAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = action.payload;
        state.canSubmit = false; // Can't submit again while pending
        state.error = null;
      })
      .addCase(submitVerificationAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to submit verification';
      });

    // Get verification status
    builder
      .addCase(getVerificationStatusAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getVerificationStatusAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = action.payload;
        state.error = null;
      })
      .addCase(getVerificationStatusAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch verification status';
      });

    // Check can submit verification
    builder
      .addCase(checkCanSubmitVerificationAsync.fulfilled, (state, action) => {
        state.canSubmit = action.payload && (!state.status || state.status.status === 'not_submitted' || state.status.status === 'rejected');
      });

    // Get verification requirements
    builder
      .addCase(getVerificationRequirementsAsync.fulfilled, (state, action) => {
        state.requirements = action.payload;
      });

    // Get verified users
    builder
      .addCase(getVerifiedUsersAsync.fulfilled, (state, action) => {
        state.verifiedUsers = action.payload;
      });
  },
});

export const { clearError, resetVerificationStatus } = verificationSlice.actions;
export default verificationSlice.reducer;
