import { createBrowserRouter, redirect } from 'react-router-dom';
import { AppShell } from './AppShell';
import { loadTokens } from '../features/auth/storage';

function requireAuth() {
  const tokens = loadTokens();
  if (!tokens) throw redirect('/login');
  if (tokens.refreshExpiresAt <= Date.now()) throw redirect('/login');
  return null;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    lazy: async () => {
      const mod = await import('@/features/auth/pages/login-page');
      return { Component: mod.LoginPage };
    },
  },
  {
    id: 'root',
    Component: AppShell,
    loader: requireAuth,
    children: [
      {
        index: true,
        lazy: async () => {
          const mod = await import('@/features/pets/pets.routes');
          return { Component: mod.PetsIndexRoute };
        },
      },
      {
        path: 'pets/*',
        lazy: async () => {
          const mod = await import('@/features/pets/pets.routes');
          return { Component: mod.PetsModuleRoutes };
        },
      },
      {
        path: 'tutores/*',
        lazy: async () => {
          const mod = await import('@/features/tutores/tutores.routes');
          return { Component: mod.TutoresModuleRoutes };
        },
      },
    ],
  },
]);
