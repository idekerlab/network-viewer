import * as ndex from 'ndex-client'
import NdexCredential from '../model/NdexCredential'

const useNdexClient = (baseUrl: string, ndexCredential: NdexCredential) => {
  const ndexClient = new ndex.NDEx(baseUrl)

  if (!ndexCredential.isLogin) {
    return ndexClient
  }

  const basicAuth = ndexCredential.basic
  ndexClient.setBasicAuth(basicAuth.userId, basicAuth.password)

  return ndexClient
}

export default useNdexClient
