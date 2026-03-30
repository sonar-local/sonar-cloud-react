/// <reference types="vitest" />
import { render } from '@testing-library/react'
import Counter from './Counter'

test('Counter component renders (no assertions)', () => {
  render(<Counter />)
})
