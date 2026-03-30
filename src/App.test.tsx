/// <reference types="vitest" />
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

test('renders Vite + React heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /vite \+ react/i })).toBeInTheDocument()
})

test('increments count when button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    const button = screen.getByRole('button', { name: /count is 0/i })
    expect(button).toBeInTheDocument()

    await user.click(button)
    expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument()

    await user.click(button)
    expect(screen.getByRole('button', { name: /count is 2/i })).toBeInTheDocument()
})
