import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { store } from '../store/store';
import { logout, refreshTokenAsync } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

// Mock API base URL - in production this would be your actual API endpoint
const API_BASE_URL = 'https://api.social-platform.demo';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    
    if (token) {
      if (!config.headers) {
        config.headers = {} as any;
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const state = store.getState();
      const refreshToken = state.auth.refreshToken;
      
      if (refreshToken) {
        try {
          // Try to refresh the token
          await store.dispatch(refreshTokenAsync()).unwrap();
          
          // Retry the original request
          const newToken = store.getState().auth.accessToken;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          store.dispatch(logout());
          toast.error('Session expired. Please log in again.');
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, logout user
        store.dispatch(logout());
        toast.error('Please log in to continue.');
      }
    }
    
    // Handle other errors
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.message) {
      toast.error(error.message);
    } else {
      toast.error('An unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);

export default api;

// Mock data for development - simulates API responses
export const mockUsers: any[] = [
  {
    id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Software developer passionate about building great user experiences. Love coffee and coding!',
    avatar: '/images/avatars/user1.png',
    isVerified: true,
    followersCount: 1250,
    followingCount: 456,
    postsCount: 89,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-06-20T15:45:00Z'
  },
  {
    id: '2',
    username: 'sarahtech',
    email: 'sarah@example.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    bio: 'Tech enthusiast | UI/UX Designer | Creating beautiful digital experiences ✨',
    avatar: '/images/avatars/user2.jpg',
    isVerified: false,
    followersCount: 890,
    followingCount: 234,
    postsCount: 156,
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-06-22T12:30:00Z'
  },
  {
    id: '3',
    username: 'mikedev',
    email: 'mike@example.com',
    firstName: 'Mike',
    lastName: 'Chen',
    bio: 'Full-stack developer | Open source contributor | Always learning new technologies',
    avatar: '/images/avatars/user3.png',
    isVerified: true,
    followersCount: 2100,
    followingCount: 567,
    postsCount: 203,
    createdAt: '2023-11-10T14:20:00Z',
    updatedAt: '2024-06-23T09:15:00Z'
  }
];

export const mockPosts: any[] = [
  {
    id: '1',
    content: 'Just finished building an amazing React app with TypeScript! The type safety really makes a difference in large projects. Anyone else loving the developer experience? 🚀',
    authorId: '1',
    author: mockUsers[0],
    likesCount: 42,
    commentsCount: 8,
    isLiked: false,
    createdAt: '2024-06-23T14:30:00Z',
    updatedAt: '2024-06-23T14:30:00Z'
  },
  {
    id: '2',
    content: 'Working on some new UI designs for a social platform. The key is finding the perfect balance between functionality and aesthetics. What are your thoughts on minimalist design? 🎨',
    authorId: '2',
    author: mockUsers[1],
    likesCount: 67,
    commentsCount: 12,
    isLiked: true,
    createdAt: '2024-06-23T11:15:00Z',
    updatedAt: '2024-06-23T11:15:00Z'
  },
  {
    id: '3',
    content: 'Contributing to open source projects has been one of the most rewarding experiences in my career. If you haven\'t tried it yet, I highly recommend starting with small issues. The community is incredibly welcoming! 💻',
    authorId: '3',
    author: mockUsers[2],
    likesCount: 89,
    commentsCount: 15,
    isLiked: false,
    createdAt: '2024-06-23T09:45:00Z',
    updatedAt: '2024-06-23T09:45:00Z'
  }
];

export const mockComments: any[] = [
  {
    id: '1',
    content: 'Totally agree! TypeScript has been a game changer for our team.',
    postId: '1',
    authorId: '2',
    author: mockUsers[1],
    likesCount: 5,
    isLiked: false,
    createdAt: '2024-06-23T14:45:00Z',
    updatedAt: '2024-06-23T14:45:00Z'
  },
  {
    id: '2',
    content: 'Love the minimalist approach! Clean designs are so much easier to navigate.',
    postId: '2',
    authorId: '3',
    author: mockUsers[2],
    likesCount: 3,
    isLiked: true,
    createdAt: '2024-06-23T11:30:00Z',
    updatedAt: '2024-06-23T11:30:00Z'
  }
];
