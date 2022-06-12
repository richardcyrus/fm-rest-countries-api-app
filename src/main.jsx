import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { getRegionList } from './api/client'
import App from './App'

import './styles/global.scss'

async function prepare() {
  if (process.env.NODE_ENV === 'development') {
    const { default: axe } = await import('@axe-core/react')
    axe(React, ReactDOM, 1000, { disableDeduplicate: true })

    const { worker } = await import('./mocks/browser')
    return worker.start({ onUnhandledRequest: 'bypass' })
  }

  return Promise.resolve()
}

const queryClient = new QueryClient()
await queryClient.prefetchQuery('regions', getRegionList)

prepare().then(() => {
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
  )
})
