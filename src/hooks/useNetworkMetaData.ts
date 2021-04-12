import { useQuery } from 'react-query'
import NdexCredential from '../model/NdexCredential'

import { getNdexClient } from '../utils/credentialUtil'

const metaDataMap = {}

const getNetworkMetaData = async <T>(
  _,
  uuid: string,
  serverUrl: string,
  apiVersion: string,
  credential: NdexCredential,
) => {
  const cache = metaDataMap[uuid]

  if (cache !== undefined) {
    return cache
  }

  if (!credential.loaded) {
    return undefined
  }

  const ndexClient = getNdexClient(`${serverUrl}/v2`, credential)

  let metaData
  metaData = await ndexClient.getMetaData(uuid)

  metaDataMap[uuid] = metaData
  return metaData
}

export default function useNetworkMetaData(
  uuid: string,
  serverUrl: string,
  apiVersion: string = 'v2',
  credential: NdexCredential,
) {
  const res = useQuery(['networkMetaData', uuid, serverUrl, apiVersion, credential], getNetworkMetaData, {
    onError: (e) => {
      console.error('* Fetch metaData error:', e)
    },
  })

  return res
}
