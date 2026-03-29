import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@mantine/core/styles.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <MantineProvider>
        <Notifications position='bottom-right'/>
        <RouterProvider router={router}/> 
    </MantineProvider>
  </StrictMode>,
)
