import { Link } from '@tanstack/react-router'

function NotFound() {
  return (
    <main id="main-content" className="main-content" role="main">
      <p>We couldn&apos;t find that page.</p>
      <Link to="/" className="button nav-button">
        Back
      </Link>
    </main>
  )
}

export default NotFound
