import { KeycloakConfig } from 'keycloak-js'

type AppConfig = {
  ndexUrl: string
  ndexHttps: string
  keycloakConfig: KeycloakConfig // Basic config for Keycloak client
  viewerThreshold: number
  maxNumObjects: number
  maxEdgeQuery: number // Maximum number of edges to be fetched
  maxDataSize: number // Maximum file size
  warningThreshold: number // Show warning data over this size
}

export default AppConfig
