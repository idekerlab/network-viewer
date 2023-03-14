import NdexCredential from '../model/NdexCredential'
import { NDEx } from '@js4cytoscape/ndex-client'
import { AuthType } from '../model/AuthType'

// const getGoogleHeader = (userInfo) => {
//   const token = userInfo.tokenObj.token_type + ' ' + userInfo.tokenObj.id_token
//   return {
//     authorization: token,
//   }
// }

const getAuthorization = (ndexCredential: NdexCredential) => {
  const { accesskey, authType, userName } = ndexCredential
  if (authType === AuthType.KEYCLOAK) {
    return 'Bearer ' + accesskey
  } else if (authType === AuthType.BASIC) {
    return 'Basic ' + window.btoa(userName + ':' + accesskey)
  }
  return undefined
}

/**
 * Utility function to create new NDEx Client using the given credential.
 *
 * @param baseUrl
 * @param ndexCredential
 * @returns
 */
const getNdexClient = (baseUrl: string, ndexCredential: NdexCredential) => {
  const { accesskey, authType, userName } = ndexCredential
  const ndexClient = new NDEx(baseUrl)

  if (authType === AuthType.NONE) {
    // Client without credential.
    console.info('No credential. Access to public networks only.')
    return ndexClient
  }

  if (authType === AuthType.KEYCLOAK) {
    if (accesskey === undefined || accesskey === null || accesskey === '') {
      console.warn(
        'Google login token does not exist. Access to public networks only.',
      )
      return ndexClient
    } else {
      ndexClient.setAuthToken(accesskey)
    }
  } else if (authType === AuthType.BASIC) {
    ndexClient.setBasicAuth(userName, accesskey)
  }

  return ndexClient
}

const getAccessKey = (searchString: string): string => {
  const trimed = searchString.replaceAll('?', '')
  const params = trimed.split('&')
  let key: string | null = null
  params.forEach((pair) => {
    const keyValue = pair.split('=')
    if (keyValue[0] === 'accesskey') {
      key = keyValue[1]
    }
  })
  return key
}

export { getAuthorization, getNdexClient, getAccessKey }
