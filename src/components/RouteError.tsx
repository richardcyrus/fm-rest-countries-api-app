import { useRouter, type ErrorComponentProps } from '@tanstack/react-router'

function RouteError({ error, reset }: ErrorComponentProps) {
  const router = useRouter()

  const retry = () => {
    reset()
    // A failed loader stays failed until it is run again.
    void router.invalidate()
  }

  return (
    <main id="main-content" className="main-content" role="main">
      <p role="alert">
        {error instanceof Error ? error.message : 'Something went wrong.'}
      </p>
      <button type="button" className="button" onClick={retry}>
        Try again
      </button>
    </main>
  )
}

export default RouteError
