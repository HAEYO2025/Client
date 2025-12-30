import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignUpMobile, SignUpWeb } from './pages/SignUp'
import { LoginMobile, LoginWeb } from './pages/Login'
import { HomeMobile, HomeWeb } from './pages/Home'
import { TrainingMobile, TrainingWeb } from './pages/Training'
import { ScenarioCreate, ScenarioCreateWeb } from './pages/ScenarioCreate'
import { ScenarioResult, ScenarioResultWeb } from './pages/ScenarioResult'
import { ScenarioFeedback } from './pages/ScenarioFeedback'
import { SafetyGuideMobile, SafetyGuideWeb } from './pages/SafetyGuide'
import { ProfileMobile, ProfileWeb } from './pages/Profile'
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

function TrainingPage() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return isMobile ? <TrainingMobile /> : <TrainingWeb />
}

function ScenarioResultPage() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return isMobile ? <ScenarioResult /> : <ScenarioResultWeb />
}

function SafetyGuidePage() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return isMobile ? <SafetyGuideMobile /> : <SafetyGuideWeb />
}

function ProfilePage() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return isMobile ? <ProfileMobile /> : <ProfileWeb />
}

function ScenarioCreatePage() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return isMobile ? <ScenarioCreate /> : <ScenarioCreateWeb />
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
          path="/scenario/create" 
          element={
            <PrivateRoute>
              <ScenarioCreatePage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/scenario/result" 
          element={
            <PrivateRoute>
              <ScenarioResultPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/scenario/feedback" 
          element={
            <PrivateRoute>
              <ScenarioFeedback />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/training" 
          element={
            <PrivateRoute>
              <TrainingPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/safety-guide" 
          element={
            <PrivateRoute>
              <SafetyGuidePage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <ProfilePage />
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
