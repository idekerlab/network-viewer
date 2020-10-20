import { useQuery } from 'react-query'
import NdexCredential from '../model/NdexCredential'
import { getNdexClient } from '../utils/credentialUtil'

const EMPTY_CX = []

const getCx = async <T>(
  _,
  uuid: string,
  serverUrl: string,
  apiVersion: string,
  credential: NdexCredential,
  threshold: number,
  objectCount: number,
  cxVersion: string
) => {
  if (!credential.loaded || apiVersion === null || serverUrl === null || uuid === null || objectCount == null) {
    // If invalid parameters, just return empty result.
    return EMPTY_CX
  }

  if (objectCount > threshold) {
    console.warn(`Network is too big (>${threshold})`)
    return EMPTY_CX
  }

  //console.log(`getting CX: ${uuid} ${serverUrl} ${apiVersion} ${credential} ${threshold} ${objectCount} ${cxVersion}`)

  const ndexClient = getNdexClient(`${serverUrl}/${apiVersion}`, credential)
  
  return cxVersion == '2' 
    ? await ndexClient.getCX2Network(uuid)
    : await ndexClient.getRawNetwork(uuid)
}

export default function useCx(
  uuid: string,
  serverUrl: string,
  apiVersion: string,
  credential: NdexCredential,
  threshold: number = 2000000,
  objectCount: number = 0,
  cxVersion: string = '1',
) {
  return useQuery(['cx', uuid, serverUrl, apiVersion, credential, threshold, objectCount, cxVersion], getCx)
}
