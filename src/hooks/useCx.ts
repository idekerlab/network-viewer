import { useQuery } from 'react-query'
import NdexCredential from '../model/NdexCredential'
import { getAccessKey, getNdexClient } from '../utils/credentialUtil'
import NDExError from '../utils/error/NDExError'
import { useLocation } from 'react-router-dom'

const EMPTY_CX = []

const getCx = async (
  uuid: string,
  serverUrl: string,
  apiVersion: string,
  credential: NdexCredential,
  threshold: number,
  objectCount: number,
  cxVersion: string,
) => {
  if (
    uuid === null ||
    apiVersion === null ||
    serverUrl === null ||
    uuid === null ||
    objectCount == null
  ) {
    // If invalid parameters, just return empty result.
    return EMPTY_CX
  }

  if (objectCount > threshold) {
    console.warn(`Network is too big (>${threshold})`)
    return EMPTY_CX
  }

  try {
    const ndexClient = getNdexClient(`${serverUrl}/${apiVersion}`, credential)
    const accesskey = credential.accesskey

    if (cxVersion === '2') {
      if (accesskey !== undefined) {
        return await ndexClient.getCX2Network(uuid, accesskey)
      }
      return await ndexClient.getCX2Network(uuid)
    } else {
      if (accesskey !== undefined) {
        return await ndexClient.getRawNetwork(uuid, accesskey)
      }
      return await ndexClient.getRawNetwork(uuid)
    }
  } catch (e: unknown) {
    const response = e['response']
    if (response !== undefined && response.status === 401) {
      console.warn('Unauthorized access to NDEx network')
      return EMPTY_CX
    }
    throw new NDExError(e['message'], e)
  }
}

export default function useCx(
  uuid: string,
  serverUrl: string,
  apiVersion: string = 'v2',
  credential: NdexCredential,
  threshold: number = 2000000,
  objectCount: number = 0,
  cxVersion: string = '1',
) {
  const location = useLocation()
  const accessKey: string = getAccessKey(location.search)
  if (accessKey !== null) {
    credential.accesskey = accessKey
  }
  return useQuery(
    [
      'cx',
      uuid,
      serverUrl,
      apiVersion,
      credential,
      threshold,
      objectCount,
      cxVersion,
    ],
    () =>
      getCx(
        uuid,
        serverUrl,
        apiVersion,
        credential,
        threshold,
        objectCount,
        cxVersion,
      ),
    {
      retry: false,
    },
  )
}
