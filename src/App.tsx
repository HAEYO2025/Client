import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignUpMobile, SignUpWeb } from './pages/SignUp'
import { LoginMobile, LoginWeb } from './pages/Login'
import { HomeMobile, HomeWeb } from './pages/Home'
import { ScenarioCreate } from './pages/ScenarioCreate'
import { useMediaQuery } from './hooks/useMediaQuery'
import { isAuthenticated } from './api/auth'
import { ReportFormWeb, ReportFormMobile } from './pages/ReportForm';
import { CommunityWeb, CommunityMobile } from './pages/Community'
import { ReportDetailWeb, ReportDetailMobile } from './pages/ReportDetail'
import './App.css'

function ReportFormPage() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return isMobile ? <ReportFormMobile /> : <ReportFormWeb />
}
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

function CommunityPage() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return isMobile ? <CommunityMobile /> : <CommunityWeb />
}

function ReportDetailPage() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return isMobile ? <ReportDetailMobile /> : <ReportDetailWeb />
}

// Protected route component
function PrivateRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route 
          path="/reportform" 
          element={
            <PrivateRoute>
              <ReportFormPage />
            </PrivateRoute>
          } 
        />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route 
          path="/scenario/create" 
          element={
            <PrivateRoute>
              <ScenarioCreate />
            </PrivateRoute>
          } 
        />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/report/:id" element={<ReportDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App