import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './hooks/redux'
import { getCurrentUserAsync } from './store/slices/authSlice'
import Layout from './components/Layout/Layout'
import AuthLayout from './components/Layout/AuthLayout'
import ProtectedRoute from './components/Auth/ProtectedRoute'

// Auth Pages
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage'

// Main Pages
import HomePage from './pages/Home/HomePage'
import ExplorePage from './pages/Explore/ExplorePage'
import ProfilePage from './pages/Profile/ProfilePage'
import SettingsPage from './pages/Settings/SettingsPage'
import NotificationsPage from './pages/Notifications/NotificationsPage'
import SearchPage from './pages/Search/SearchPage'
import PostDetailPage from './pages/Post/PostDetailPage'

// Loading Component
import LoadingSpinner from './components/Common/LoadingSpinner'

function App() {
  const dispatch = useAppDispatch()
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth)
  const theme = useAppSelector((state) => state.ui.theme)

  useEffect(() => {
    // Apply theme to document
    document.documentElement.className = theme

    // Try to restore user session on app start
    const token = localStorage.getItem('accessToken')
    if (token && !isAuthenticated) {
      dispatch(getCurrentUserAsync())
    }
  }, [dispatch, isAuthenticated, theme])

  // Show loading spinner during initial authentication check
  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile/:username" element={<ProfilePage />} />
          <Route path="post/:postId" element={<PostDetailPage />} />
        </Route>

        {/* Redirect to appropriate page based on auth status */}
        <Route
          path="*"
          element={
            <Navigate 
              to={isAuthenticated ? "/" : "/auth/login"} 
              replace 
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App
