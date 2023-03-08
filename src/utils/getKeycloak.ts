import Keycloak, { KeycloakConfig } from 'keycloak-js'

let keycloak: Keycloak | undefined

/**
 * A function to return a singlton
 */
export const getKeycloak = (config?: KeycloakConfig) => {
  if (config === undefined && keycloak === undefined) {
    throw new Error('Keycloak config is missing')
  }

  if (keycloak === undefined) {
    console.log('Need to create a new Keycloak iunstance???? ')
    keycloak = new Keycloak(config)
  }

  return keycloak
}
