import { createContext } from 'react'
import Keycloak from 'keycloak-js'

type KeycloakContextValue = {
  client: Keycloak
  initialized: boolean
  setInitialized: (initialized: boolean) => void
  token: string
}

const KeycloakContext = createContext<KeycloakContextValue>(
  {} as KeycloakContextValue,
)

export default KeycloakContext
