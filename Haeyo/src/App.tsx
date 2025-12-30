import { SignUpMobile, SignUpWeb } from './pages/SignUp'
import { useMediaQuery } from './hooks/useMediaQuery'
import './App.css'

function App() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  
  return isMobile ? <SignUpMobile /> : <SignUpWeb />
}

export default App
