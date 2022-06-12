import PropTypes from 'prop-types'

import { MoonIcon } from '@heroicons/react/outline'

function ThemeToggle({ toggleTheme }) {
  return (
    <button
      type="button"
      className="button theme-toggle-button"
      onClick={toggleTheme}
    >
      <MoonIcon className="theme-toggle-icon" />
      Dark Mode
    </button>
  )
}

ThemeToggle.propTypes = {
  toggleTheme: PropTypes.func.isRequired,
}

export default ThemeToggle
