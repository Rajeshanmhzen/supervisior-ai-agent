
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/shared/Header'
import Footer from './components/shared/Footer'
import { authService } from './services/auth'
import { authStorage } from './services/authStorage'
function App() {
  const { pathname } = useLocation()
  const isDashboard = pathname.startsWith('/dashboard')
  useEffect(() => {
    const bootstrap = async () => {
      if (authStorage.getAccessToken()) return
      try {
        const result = await authService.refresh()
        authStorage.setAccessToken(result.accessToken)
      } catch {
        // ignore if refresh token is missing/expired
      }
    }
    bootstrap()
  }, [])
  return (
    <>
    <div className='min-h-screen'>
      {!isDashboard && <Header />}
      <div>
      <Outlet />
      </div>
      {!isDashboard && <Footer />}
    </div>
    </>
  )
}

export default App
