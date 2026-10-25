/// <reference types="vite/client" />
import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'
import Header from '~/components/Header'
import { getTheme } from '~/server/theme'

import '~/styles/global.css'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  loader: () => getTheme(),
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { title: 'REST Countries API | Frontend Mentor' },
      {
        name: 'description',
        content:
          'This is a solution to the REST Countries API with color theme switcher challenge on Frontend Mentor',
      },
      { name: 'color-scheme', content: 'light dark' },
    ],
    links: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/modern-css-reset/dist/reset.min.css',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@200;400;600;900&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootComponent,
})

function RootDocument({ children }: { children: ReactNode }) {
  const theme = Route.useLoaderData()

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className={theme === 'dark' ? 'dark' : undefined}>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  return (
    <>
      <Header />
      <Outlet />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}
