import NdexCredential from '../model/NdexCredential'
import { NDEx } from '@js4cytoscape/ndex-client'

// const getGoogleHeader = (userInfo) => {
//   const token = userInfo.tokenObj.token_type + ' ' + userInfo.tokenObj.id_token
//   return {
//     authorization: token,
//   }
// }

const getAuthorization = (ndexCredential: NdexCredential) => {
  const { idToken, authenticated } = ndexCredential
  if (authenticated) {
    return 'Bearer ' + idToken
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
  const { idToken, authenticated } = ndexCredential
  const ndexClient = new NDEx(baseUrl)

  if (authenticated) {
    if (idToken === undefined || idToken === null || idToken === '') {
      console.warn(
        'Keycloak login token does not exist. Access to public networks only.',
      )
      return ndexClient
    } else {
      ndexClient.setAuthToken(idToken)
    }
  } else {
    console.info('No credential. Access to public networks only.')
    return ndexClient
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
