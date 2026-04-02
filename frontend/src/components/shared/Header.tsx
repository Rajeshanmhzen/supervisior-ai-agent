import { Button } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import MoniveoLogo from './MoniveoLogo'
import { authService } from '../../services/auth'
import { authStorage } from '../../services/authStorage'
import { notifications } from '@mantine/notifications'

const Header = () => {
  const navigate  = useNavigate()
  const { pathname } = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAuthed, setIsAuthed] = useState(() => Boolean(authStorage.getAccessToken()))
  const navlinks = [
    { name: 'Home', link: '/' },
    { name: 'About', link: '/about' },
    { name: 'Services', link: '/services' },
    { name: 'Contact', link: '/contact' },
  ]

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const unsubscribe = authStorage.subscribe(() => {
      setIsAuthed(Boolean(authStorage.getAccessToken()))
    })
    return unsubscribe
  }, [])

  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="flex justify-center">
        <div
          className={`flex justify-between items-center px-8 h-20 transition-all duration-300 ease-out ${
            isScrolled
              ? 'w-[80%] mt-[10px] rounded-full bg-white/80 backdrop-blur-xl shadow-lg'
              : 'w-full mt-0 bg-white'
          }`}
        >
        <div className="text-2xl font-black tracking-tighter text-blue-600 font-headline flex items-center gap-2">
          <MoniveoLogo />
                <span
                  className="font-manrope text-base font-semibold tracking-tight"
                  style={{ color: "#191c1e" }}
                >
                  Moniveo
                </span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-headline font-semibold text-sm tracking-tight">
          {navlinks.map((item) => {
            const isActive =
              item.link === '/'
                ? pathname === '/'
                : pathname.startsWith(item.link)

            return (
              <a
                key={item.name}
                className={
                  isActive
                    ? 'text-primary font-bold'
                    : 'text-slate-600 hover:text-blue-600 transition-colors'
                }
                href={item.link}
              >
                {item.name}
              </a>
            )
          })}
        </div>
        <div className="flex items-center gap-4">
          <Button
          onClick={async () => {
            if (!isAuthed) {
              navigate('/login')
              return
            }
            try {
              await authService.logout()
              notifications.show({
                title: 'Logged out',
                message: 'You have been signed out.',
                color: 'green',
              })
            } finally {
              authStorage.clear()
              navigate('/login')
            }
          }}
            unstyled
            className="px-6 py-2.5 rounded-full font-headline text-sm font-bold bg-primary text-on-primary hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            {isAuthed ? 'Logout' : 'Sign In'}
          </Button>
          {isAuthed && (
            <Button
              onClick={() => navigate('/dashboard')}
              unstyled
              className="px-6 py-2.5 rounded-full font-headline text-sm font-bold border border-primary text-primary hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              Dashboard
            </Button>
          )}
        </div>
        </div>
      </div>
    </nav>
  )
}

export default Header
