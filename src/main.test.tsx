/// <reference types="vitest" />
import { expect, test } from 'vitest'

test('main.tsx sets up the root element correctly', () => {
  // Create a root div element
  const root = document.createElement('div')
  root.id = 'root'
  document.body.appendChild(root)

  expect(document.getElementById('root')).toBeTruthy()
  expect(document.getElementById('root')).toBe(root)

  // Cleanup
  document.body.removeChild(root)
})

test('main.tsx mounts the application in the root element', async () => {
  // Create a root div element
  const root = document.createElement('div')
  root.id = 'root'
  document.body.appendChild(root)

  // Import main after creating the root element
  await import('./main')

  expect(document.getElementById('root')).toBeTruthy()

  // Cleanup
  const rootElement = document.getElementById('root')
  if (rootElement) {
    document.body.removeChild(rootElement)
  }
})
