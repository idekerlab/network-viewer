import NdexCredential from '../model/NdexCredential'
// import * as ndex from '@js4cytoscape/ndex-client'
import { NDEx } from '@js4cytoscape/ndex-client'

const getGoogleHeader = (userInfo) => {
  const token = userInfo.tokenObj.token_type + ' ' + userInfo.tokenObj.id_token
  return {
    authorization: token,
  }
}

const getAuthorization = (ndexCredential: NdexCredential) => {
  if (ndexCredential.isGoogle) {
    const idToken = ndexCredential.oauth['loginDetails'].tokenId
    return 'Bearer ' + idToken
  } else if (ndexCredential.basic) {
    const basicAuth = ndexCredential.basic
    return 'Basic ' + window.btoa(basicAuth.userId + ':' + basicAuth.password)
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
  const ndexClient = new NDEx(baseUrl)

  if (!ndexCredential.isLogin) {
    // Client without credential.
    console.info('No credential. Access to public networks only.')
    return ndexClient
  }

  if (ndexCredential.isGoogle) {
    const { oauth } = ndexCredential
    const { tokenId } = oauth['loginDetails']

    if (tokenId === undefined || tokenId === null || tokenId === '') {
      console.warn(
        'Google login token does not exist. Access to public networks only.',
      )
      return ndexClient
    } else {
      ndexClient.setAuthToken(tokenId)
    }
  } else if (ndexCredential.basic) {
    const basicAuth = ndexCredential.basic
    ndexClient.setBasicAuth(basicAuth.userId, basicAuth.password)
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

export { getGoogleHeader, getAuthorization, getNdexClient, getAccessKey }
