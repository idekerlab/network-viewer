import { useQuery } from 'react-query'
import NdexCredential from '../model/NdexCredential'

import { getNdexClient } from '../utils/credentialUtil'

const summaryMap = {}

const getNetworkSummary = async <T>(
  _,
  uuid: string,
  serverUrl: string,
  apiVersion: string,
  credential: NdexCredential,
) => {
  const cache = summaryMap[uuid]

  if (cache !== undefined) {
    return cache
  }

  if (!credential.loaded) {
    return undefined
  }

  const ndexClient = getNdexClient(`${serverUrl}/v2`, credential)

  let summary
  summary = await ndexClient.getNetworkSummary(uuid)

  summaryMap[uuid] = summary
  return summary
}

export default function useNetworkSummary(
  uuid: string,
  serverUrl: string,
  apiVersion: string = 'v2',
  credential: NdexCredential,
) {
  const res = useQuery(['networkSummary', uuid, serverUrl, apiVersion, credential], getNetworkSummary, {
    onError: (e) => {
      console.error('* Fetch summary error:', e)
    },
  })

  return res
}
