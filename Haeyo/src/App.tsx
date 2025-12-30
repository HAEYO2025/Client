import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignUpMobile, SignUpWeb } from './pages/SignUp'
import { LoginMobile, LoginWeb } from './pages/Login'
import { useMediaQuery } from './hooks/useMediaQuery'
import './App.css'

function LoginPage() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return isMobile ? <LoginMobile /> : <LoginWeb />
}

function SignUpPage() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return isMobile ? <SignUpMobile /> : <SignUpWeb />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
