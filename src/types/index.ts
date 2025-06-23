// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  isFollowing?: boolean;
  isFollower?: boolean;
  mutualFollows?: number;
}

export interface UserStats {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  likesReceived: number;
  commentsReceived: number;
}

// Auth Types
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// Post Types
export interface Post {
  id: string;
  content: string;
  authorId: string;
  author: User;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  content: string;
}

export interface PostStats {
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
}

// Comment Types
export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  author: User;
  parentId?: string;
  replies?: Comment[];
  likesCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  content: string;
  postId: string;
  parentId?: string;
}

// Follow Types
export interface FollowRelationship {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface FollowStatus {
  isFollowing: boolean;
  isFollower: boolean;
  isMutual: boolean;
}

// Verification Types
export interface VerificationStatus {
  status: 'pending' | 'approved' | 'rejected' | 'not_submitted';
  submittedAt?: string;
  reviewedAt?: string;
  reason?: string;
}

export interface VerificationRequirements {
  minFollowers: number;
  minPosts: number;
  accountAge: number; // days
  hasProfilePicture: boolean;
  hasBio: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// UI Types
export interface UIState {
  theme: 'light' | 'dark';
  isLoading: boolean;
  notifications: Notification[];
  modals: {
    createPost: boolean;
    editProfile: boolean;
    followers: boolean;
    following: boolean;
  };
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  createdAt: string;
}

// Search Types
export interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
}

export interface SearchResults<T> {
  results: T[];
  total: number;
  query: string;
}
