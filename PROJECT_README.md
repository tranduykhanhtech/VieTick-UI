# Social Media Platform

A comprehensive React TypeScript social media platform with Redux state management and Axios for API integration.

## 🚀 Features

### ✅ Complete Implementation
- **Authentication System**: Register, Login, Email verification, Password management
- **User Management**: Profile management, Username/email updates, User search
- **Social Features**: Posts, Comments, Like system, Follow/Unfollow
- **Content Discovery**: Feed, Explore, Search functionality
- **User Verification**: Identity verification system
- **Real-time UI**: Modern responsive design with dark/light theme

### 🛠 Tech Stack
- **Frontend**: React 18.3 + TypeScript
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS + Radix UI Components
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation
- **Build Tool**: Vite
- **UI Components**: 40+ Pre-built components

### 📁 Project Structure
```
src/
├── components/         # Reusable UI components
│   ├── Auth/          # Authentication components
│   ├── Layout/        # Layout components (Header, Sidebar)
│   ├── Posts/         # Post-related components
│   ├── Users/         # User-related components
│   └── ui/            # Base UI components (40+ components)
├── pages/             # Page components
│   ├── Auth/          # Login, Register, etc.
│   ├── Home/          # Feed/Dashboard
│   ├── Profile/       # User profiles
│   ├── Explore/       # Content discovery
│   └── Settings/      # User settings
├── store/             # Redux store and slices
│   └── slices/        # Individual feature slices
├── api/               # API configuration and services
├── types/             # TypeScript type definitions
└── hooks/             # Custom React hooks
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

## 🌐 API Endpoints Implemented

The application includes full Redux integration for all these API endpoints:

### Authentication (`/auth`)
- ✅ `POST /auth/register` - Register new user
- ✅ `POST /auth/login` - Login user  
- ✅ `POST /auth/refresh` - Refresh access token
- ✅ `POST /auth/logout` - Logout (invalidate refresh token)
- ✅ `POST /auth/logout-all` - Logout from all devices
- ✅ `POST /auth/verify-email` - Verify email address
- ✅ `POST /auth/resend-verification` - Resend verification email
- ✅ `POST /auth/change-password` - Change password
- ✅ `GET /auth/me` - Get current user info
- ✅ `GET /auth/check` - Check token validity

### Users (`/users`)
- ✅ `GET /users/me` - Get current user profile
- ✅ `PUT /users/me` - Update profile
- ✅ `PUT /users/me/username` - Update username
- ✅ `PUT /users/me/email` - Update email
- ✅ `GET /users/{id}` - Get user profile by ID
- ✅ `GET /users/username/{username}` - Get user profile by username
- ✅ `GET /users/{id}/stats` - Get user statistics
- ✅ `GET /users/search` - Search users
- ✅ `GET /users/recommended` - Get recommended users
- ✅ `GET /users/check-username` - Check username availability
- ✅ `GET /users/check-email` - Check email availability

### Posts (`/posts`)
- ✅ `POST /posts` - Create post
- ✅ `GET /posts/{id}` - Get post by ID
- ✅ `PUT /posts/{id}` - Update post
- ✅ `DELETE /posts/{id}` - Delete post
- ✅ `GET /posts/feed` - Get user feed
- ✅ `GET /posts/explore` - Get explore posts
- ✅ `GET /posts/search` - Search posts
- ✅ `GET /posts/user/{user_id}` - Get user posts
- ✅ `POST /posts/{id}/like` - Like post
- ✅ `POST /posts/{id}/unlike` - Unlike post
- ✅ `POST /posts/{id}/toggle-like` - Toggle like status
- ✅ `GET /posts/{id}/stats` - Get post statistics

### Comments (`/comments`)
- ✅ `POST /posts/{post_id}/comments` - Create comment
- ✅ `GET /posts/{post_id}/comments` - Get post comments
- ✅ `GET /comments/{id}` - Get comment by ID
- ✅ `PUT /comments/{id}` - Update comment
- ✅ `DELETE /comments/{id}` - Delete comment
- ✅ `POST /comments/{id}/like` - Like comment
- ✅ `POST /comments/{id}/unlike` - Unlike comment
- ✅ `POST /comments/{id}/toggle-like` - Toggle like status
- ✅ `GET /comments/{id}/stats` - Get comment statistics

### Follow System (`/follows`)
- ✅ `POST /users/{user_id}/follow` - Follow user
- ✅ `POST /users/{user_id}/unfollow` - Unfollow user
- ✅ `POST /users/{user_id}/toggle-follow` - Toggle follow status
- ✅ `GET /users/{user_id}/follow-status` - Get follow status
- ✅ `GET /users/{user_id}/followers` - Get user followers
- ✅ `GET /users/{user_id}/following` - Get users followed by user
- ✅ `GET /users/{user_id}/follow-counts` - Get follow counts
- ✅ `GET /users/{user_id}/mutual-follows` - Get mutual follows
- ✅ `GET /users/{user_id}/relationship` - Get follow relationship
- ✅ `GET /users/{user_id}/follow-stats` - Get follow statistics
- ✅ `POST /follows/bulk-follow` - Bulk follow users
- ✅ `POST /follows/bulk-unfollow` - Bulk unfollow users

### Verification (`/verification`)
- ✅ `POST /verification/submit` - Submit identity verification
- ✅ `GET /verification/me` - Get user verification status
- ✅ `GET /verification/can-submit` - Check if can submit verification
- ✅ `GET /verification/requirements` - Get verification requirements
- ✅ `GET /verification/verified-users` - Get verified users list

## 🎨 UI Components

### Pre-built Components (40+)
- Accordion, Alert Dialog, Aspect Ratio
- Avatar, Button, Calendar, Card
- Checkbox, Collapsible, Command
- Context Menu, Dialog, Drawer
- Dropdown Menu, Form, Hover Card
- Input, Label, Menubar, Navigation
- Pagination, Popover, Progress
- Radio Group, Resizable, Scroll Area
- Select, Separator, Sheet, Sidebar
- Slider, Switch, Table, Tabs
- Textarea, Toast, Toggle, Tooltip
- And more...

## 🔐 Configuration

### API Configuration
Update the API base URL in `src/api/config.ts`:
```typescript
export const API_BASE_URL = 'https://your-api-domain.com/api'
```

### Environment Variables
Create a `.env` file:
```
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_NAME=Social Media Platform
```

## 📱 Features Overview

### Authentication Flow
- Complete registration with email verification
- Secure login with JWT tokens
- Password reset functionality
- Multi-device logout support

### Social Features  
- Create and manage posts
- Comment system with nested replies
- Like/unlike posts and comments
- Follow/unfollow users
- User discovery and recommendations

### User Experience
- Responsive design (mobile-first)
- Dark/light theme support
- Real-time UI updates
- Loading states and error handling
- Form validation with Zod

## 🚀 Deployment

### Production Build
The `dist/` folder contains the production-ready files:
- Optimized and minified assets
- Ready for static hosting (Vercel, Netlify, etc.)
- CDN-friendly structure

### Deploy Commands
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using React, TypeScript, Redux, and modern web technologies**
