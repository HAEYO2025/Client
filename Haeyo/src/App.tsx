import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignUpMobile, SignUpWeb } from './pages/SignUp'
import { LoginMobile, LoginWeb } from './pages/Login'
import { HomeMobile, HomeWeb } from './pages/Home'
import { useMediaQuery } from './hooks/useMediaQuery'
import { isAuthenticated } from './api/auth'
import './App.css'

function LoginPage() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return isMobile ? <LoginMobile /> : <LoginWeb />
}

function SignUpPage() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return isMobile ? <SignUpMobile /> : <SignUpWeb />
}

function HomePage() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return isMobile ? <HomeMobile /> : <HomeWeb />
}

// Protected route component
function PrivateRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route 
          path="/home" 
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/" 
          element={
            isAuthenticated() ? 
              <Navigate to="/home" replace /> : 
              <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
