import { useQuery } from 'react-query'
import NdexCredential from '../model/NdexCredential'

import { getNdexClient } from '../utils/credentialUtil'
import NDExError from '../utils/error/NDExError'

const metaDataMap = {}

const getNetworkMetaData = async (
  uuid: string,
  serverUrl: string,
  apiVersion: string,
  credential: NdexCredential,
) => {
  const cache = metaDataMap[uuid]

  if (cache !== undefined) {
    return cache
  }

  if (credential === undefined || (credential.accessKey === undefined && credential.idToken === undefined)) {
    return undefined
  }

  try {
    const ndexClient = getNdexClient(`${serverUrl}/${apiVersion}`, credential)
    const metaData = await ndexClient.getMetaData(uuid, credential.accessKey)
    metaDataMap[uuid] = metaData
    return metaData
  } catch (e: unknown) {
    throw new NDExError(e['message'], e)
  }
}

export default function useNetworkMetaData(
  uuid: string,
  serverUrl: string,
  apiVersion: string = 'v2',
  credential: NdexCredential,
) {
  const res = useQuery(
    ['networkMetaData', uuid, serverUrl, apiVersion, credential],
    () => getNetworkMetaData(uuid, serverUrl, apiVersion, credential),
    {
      retry: false,
    },
  )

  return res
}
