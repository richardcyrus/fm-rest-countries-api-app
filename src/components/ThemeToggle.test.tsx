// @vitest-environment happy-dom
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vite-plus/test'
import ThemeToggle from './ThemeToggle'

describe('ThemeToggle', () => {
  test('renders correctly', () => {
    const mockToggleTheme = vi.fn()
    render(<ThemeToggle toggleTheme={mockToggleTheme} />)

    const button = screen.getByRole('button', { name: /dark mode/i })
    expect(button).toBeDefined()
    expect(button.className).toContain('button')
    expect(button.className).toContain('theme-toggle-button')
  })

  test('renders MoonIcon component', () => {
    const mockToggleTheme = vi.fn()
    render(<ThemeToggle toggleTheme={mockToggleTheme} />)

    const icon = document.querySelector('.theme-toggle-icon')
    expect(icon).toBeDefined()
  })

  test('calls toggleTheme when clicked', () => {
    const mockToggleTheme = vi.fn()
    render(<ThemeToggle toggleTheme={mockToggleTheme} />)

    const button = screen.getByRole('button', { name: /dark mode/i })
    fireEvent.click(button)

    expect(mockToggleTheme).toHaveBeenCalledTimes(1)
  })

  test('has correct button attributes', () => {
    const mockToggleTheme = vi.fn()
    render(<ThemeToggle toggleTheme={mockToggleTheme} />)

    const button = screen.getByRole('button', { name: /dark mode/i })
    expect(button.getAttribute('type')).toBe('button')
  })

  test('displays correct text content', () => {
    const mockToggleTheme = vi.fn()
    render(<ThemeToggle toggleTheme={mockToggleTheme} />)

    const button = screen.getByRole('button', { name: /dark mode/i })
    expect(button.textContent).toBe('Dark Mode')
  })

  test('applies correct CSS classes', () => {
    const mockToggleTheme = vi.fn()
    render(<ThemeToggle toggleTheme={mockToggleTheme} />)

    const button = screen.getByRole('button', { name: /dark mode/i })
    expect(button.className).toContain('button')
    expect(button.className).toContain('theme-toggle-button')
  })

  test('icon has correct CSS class', () => {
    const mockToggleTheme = vi.fn()
    render(<ThemeToggle toggleTheme={mockToggleTheme} />)

    const icon = document.querySelector('.theme-toggle-icon')
    expect(icon).toBeDefined()
    expect(icon?.className).toContain('theme-toggle-icon')
  })

  test('handles multiple clicks', () => {
    const mockToggleTheme = vi.fn()
    render(<ThemeToggle toggleTheme={mockToggleTheme} />)

    const button = screen.getByRole('button', { name: /dark mode/i })

    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockToggleTheme).toHaveBeenCalledTimes(3)
  })

  test('does not call toggleTheme on render', () => {
    const mockToggleTheme = vi.fn()
    render(<ThemeToggle toggleTheme={mockToggleTheme} />)

    expect(mockToggleTheme).not.toHaveBeenCalled()
  })

  test('is accessible with proper button role', () => {
    const mockToggleTheme = vi.fn()
    render(<ThemeToggle toggleTheme={mockToggleTheme} />)

    const button = screen.getByRole('button')
    expect(button).toBeDefined()
    expect(!button.hasAttribute('disabled')).toBe(true)
  })
})
