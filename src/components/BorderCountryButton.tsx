import { Link } from '@tanstack/react-router'

function BorderCountryButton({ code, name }: { code: string; name: string }) {
  return (
    <Link
      to="/details/$code"
      params={{ code }}
      className="button border-country-button"
    >
      {name}
    </Link>
  )
}

export default BorderCountryButton
