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
) => {
  if (apiVersion === null || serverUrl === null || uuid === null) {
    // If invalid parameters, just return empty result.
    return EMPTY_CX
  }

  if (objectCount > threshold) {
    console.warn(`Network is too big (>${threshold})`)
    return EMPTY_CX
  }

  const ndexClient = getNdexClient(`${serverUrl}/${apiVersion}`, credential)
  return await ndexClient.getRawNetwork(uuid)
}

export default function useCx(
  uuid: string,
  serverUrl: string,
  apiVersion: string,
  credential: NdexCredential,
  threshold: number = 5000000,
  objectCount: number = 0,
) {
  return useQuery(['cx', uuid, serverUrl, apiVersion, credential, threshold, objectCount], getCx)
}
