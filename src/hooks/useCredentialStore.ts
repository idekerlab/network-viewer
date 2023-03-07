import Keycloak from 'keycloak-js'
import { useEffect, useState } from 'react'

export const useCredential = async () => {
  const [keycloak, setKeycloak] = useState<Keycloak>(new Keycloak())

  useEffect(() => {
    const fetchCredentials = async () => {}
    fetchCredentials()
  }, [])

  const getCredentials = async () => {
    const refreshed = await keycloak.updateToken(70)
    if (refreshed) {
      return keycloak.token
    } else {
      return keycloak.token
    }
  }

  return getCredentials()
}
