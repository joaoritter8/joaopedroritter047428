import { createBrowserRouter} from 'react-router-dom'
import { AppShell } from './AppShell'


export const router = createBrowserRouter([
  {
    path: '/login',
    lazy: async () => {
      const mod = await import('@/features/auth/pages/login-page')
      return { Component: mod.LoginPage }
    },
  },
  {
    id: 'root',
    Component: AppShell,
    children: [
      {
        index: true,
        lazy: async () => {
          const mod = await import('@/features/pets/pets.routes')
          return { Component: mod.PetsIndexRoute }
        },
      },
      {
        path: 'pets/*',
        lazy: async () => {
          const mod = await import('@/features/pets/pets.routes')
          return { Component: mod.PetsModuleRoutes }
        },
      },
      {
        path: 'tutores/*',
        lazy: async () => {
          const mod = await import('@/features/tutores/tutores.routes')
          return { Component: mod.TutoresModuleRoutes }
        },
      },
    ],
  },
])
