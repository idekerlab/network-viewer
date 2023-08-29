import React from 'react'
import { render } from '@testing-library/react'
import App from './App'

// TODO: add more realistic tests
test('render app', () => {
  const { getByText } = render(<App config={{}} keycloak={{}} credential={{}} />)
})
