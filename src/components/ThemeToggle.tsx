import { MoonIcon } from '@heroicons/react/24/outline'

function ThemeToggle({ toggleTheme }: { toggleTheme: () => void }) {
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

export default ThemeToggle
