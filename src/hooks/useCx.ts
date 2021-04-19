import { useQuery } from 'react-query'
import NdexCredential from '../model/NdexCredential'
import { getNdexClient } from '../utils/credentialUtil'
import NDExError from '../utils/error/NDExError'

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
    !credential.loaded ||
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
    return cxVersion === '2'
      ? await ndexClient.getCX2Network(uuid)
      : await ndexClient.getRawNetwork(uuid)
  } catch (e: unknown) {
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
