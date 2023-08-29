import { useEffect, useState } from 'react'
import { getKeycloak } from '../utils/getKeycloak'
import KeycloakContext from './KeycloakContext'

import Keycloak from 'keycloak-js'

let init1 = false
export const KeycloakContextProvider = ({ children, keycloakConfig }) => {
  const [token, setToken2] = useState<string>('')
  const [initialized, setInitialized] = useState<boolean>(false)

  const client: Keycloak = getKeycloak(keycloakConfig)
  useEffect(() => {
    if (client === undefined) {
      return
    }
    // console.log('! KeycloakContextProvider:useEffect INIT', client)

    // client.onAuthSuccess = () => {
    //   console.log('onAuthSuccess------------------', client.authenticated)
    //   if (client.authenticated) {
    //     console.info(
    //       '*3 Keycloak initialized and is authenticated.',
    //       client.token,
    //       client.tokenParsed.name,
    //     )
    //     setToken2(client.token)

    //     setTimeout(() => {
    //       console.log('win TGOKEN3=', token)
    //     }, 2000)
    //   } else {
    //     console.info(
    //       '!3 Keycloak initialized but is not authenticated.',
    //       client,
    //     )
    //   }
    //   setInitialized(true)
    //   init1 = true
    // }

    client.onAuthError = () => {
      console.log('onAuthError------------------')
    }

    if (!init1) {
      console.log('!!!!!!!!!!!!!!!!!!!!!!!! INIT Start', client)
      client
        .init({
          onLoad: 'check-sso',
          checkLoginIframe: false,
          silentCheckSsoRedirectUri:
            window.location.origin + `/silent-check-sso.html`,
        })
        .then((authenticated) => {
          console.log('!!!!!!!!!!!!!!!!!!!!!!!! INIT DONE', client.tokenParsed)
        })
    }
  }, [])

  return (
    <KeycloakContext.Provider
      value={{
        client,
        initialized,
        setInitialized,
        token,
      }}
    >
      {children}
    </KeycloakContext.Provider>
  )
}
