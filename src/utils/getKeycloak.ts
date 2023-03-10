import Keycloak, { KeycloakConfig } from 'keycloak-js'

let keycloak: Keycloak | undefined

const KEYCLOAK_TAG = 'isKeycloakCreated'

/**
 * A function to return a singleton
 */
export const getKeycloak = (config?: KeycloakConfig) => {
  if (config === undefined && keycloak === undefined) {
    throw new Error('Keycloak config is missing')
  }

  const isInitialized: string = localStorage.getItem(KEYCLOAK_TAG)

  if (keycloak === undefined || isInitialized === null) {
    keycloak = new Keycloak(config)
    localStorage.setItem(KEYCLOAK_TAG, 'true')
    console.info(
      'Keycloak client initialized. If you see this message more than once, something is wrong.',
    )
  }

  return keycloak
}
