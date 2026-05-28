import { StrictMode } from 'react'
import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { initTheme, resolveThemeMode, themeStorage } from './services/theme'


initTheme()

const Root = () => {
  const [colorScheme, setColorScheme] = useState(() => resolveThemeMode(themeStorage.getMode()))

  useEffect(() => {
    const syncColorScheme = () => setColorScheme(resolveThemeMode(themeStorage.getMode()))
    const unsubscribe = themeStorage.subscribe(syncColorScheme)
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', syncColorScheme)
    return () => {
      unsubscribe()
      media.removeEventListener('change', syncColorScheme)
    }
  }, [])

  return (
    <MantineProvider forceColorScheme={colorScheme}>
      <Notifications position="bottom-right" />
      <RouterProvider router={router} />
    </MantineProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
