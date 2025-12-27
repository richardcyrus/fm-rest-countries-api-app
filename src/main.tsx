import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { getRegionList } from '~/api/client'
import App from '~/App'

import './styles/global.scss'

async function enableMocking() {
  if (import.meta.env.VITE_API_MOCK !== 'true') {
    return
  }

  const { worker } = await import('~/mocks/browser')

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start({ onUnhandledRequest: 'bypass' })
}

const queryClient = new QueryClient()
await queryClient.prefetchQuery({
  queryKey: ['regions'],
  queryFn: getRegionList,
})

const rootElement = document.getElementById('root')

enableMocking().then(() => {
  createRoot(rootElement!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  )
})
