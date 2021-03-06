import NdexCredential from '../model/NdexCredential'
import * as ndex from 'ndex-client'
import { useGoogleLogin } from 'react-google-login'

const getGoogleHeader = (userInfo) => {
  const token = userInfo.tokenObj.token_type + ' ' + userInfo.tokenObj.id_token
  return {
    authorization: token,
  }
}

const getAuthorization = (ndexCredential: NdexCredential) => {
  if (ndexCredential.isGoogle) {
    const idToken =  ndexCredential.oauth['loginDetails'].tokenId;
    return  'Bearer ' + idToken;
  } else if (ndexCredential.basic) {
    const basicAuth = ndexCredential.basic
    return 'Basic ' + window.btoa(basicAuth.userId + ':' + basicAuth.password);
  }
  return undefined;
}

const getNdexClient = (baseUrl: string, ndexCredential: NdexCredential) => {
  console.log('++++++++++++ BASE URL ++++++++++', baseUrl)
  const ndexClient = new ndex.NDEx(baseUrl)
  
  console.log('* Credential: ' + ndexCredential)
  if (ndexCredential.isGoogle) {
    ndexClient.setAuthToken(ndexCredential.oauth['loginDetails'].tokenId);
    //console.log('Auth Token ID: ' + ndexCredential.oauth['loginDetails'].tokenId);
    console.log('NDEx client with OAuth ::', ndexClient)
  } else if (ndexCredential.basic) {
    const basicAuth = ndexCredential.basic
    ndexClient.setBasicAuth(basicAuth.userId, basicAuth.password)
    console.log('NDEx client with Basic Auth ::', ndexClient)
  }

  ndexClient.getStatus().then((response) => {
    console.log('* NDEx Status checked: ' + response.message)
  })
  
  if (!ndexCredential.isLogin) {
    // Client without credential.
    console.warn('Not logged-in. Public networks only.')
    return ndexClient
  }

  
  
  return ndexClient
}



export { getGoogleHeader, getAuthorization,  getNdexClient }
