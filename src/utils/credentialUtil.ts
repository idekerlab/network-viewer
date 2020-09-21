import NdexCredential from '../model/NdexCredential'
import * as ndex from 'ndex-client'
import { useGoogleLogin } from 'react-google-login'

const getGoogleHeader = (userInfo) => {
  const token = userInfo.tokenObj.token_type + ' ' + userInfo.tokenObj.id_token
  return {
    authorization: token,
  }
}

const getNdexClient = (baseUrl: string, ndexCredential: NdexCredential) => {
  console.log('++++++++++++ BASE URL ++++++++++', baseUrl)
  const ndexClient = new ndex.NDEx(baseUrl)
  ndexClient.getStatus().then((response) => {
    console.log('* NDEx Status checked: ' + response.message)
  })

  if (!ndexCredential.isLogin) {
    // Client without credential.
    console.warn('Not logged-in. Public networks only.')
    return ndexClient
  }

  console.log('* Credential: ' + ndexCredential)
  if (ndexCredential.isGoogle) {
    // TODO: add credential
    console.log('NDEx client with OAuth ::', ndexClient)
  } else {
    const basicAuth = ndexCredential.basic
    ndexClient.setBasicAuth(basicAuth.userId, basicAuth.password)
    console.log('NDEx client with Basic Auth ::', ndexClient)
  }
  
  return ndexClient
}



export { getGoogleHeader, getNdexClient }
