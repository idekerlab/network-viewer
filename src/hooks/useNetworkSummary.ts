import { useQuery } from 'react-query'
import NdexCredential from '../model/NdexCredential'
import { getNdexClient } from '../utils/credentialUtil'
import NDExError from '../utils/error/NDExError'

const summaryMap = {}

async function getNetworkSummary(
  uuid: string,
  serverUrl: string,
  apiVersion: string,
  credential: NdexCredential,
) {
  const cache = summaryMap[uuid]

  if (cache !== undefined) {
    return cache
  }

  if (!credential.loaded) {
    return undefined
  }

  const ndexUrl = `${serverUrl}/${apiVersion}`
  try {
    const ndexClient = getNdexClient(ndexUrl, credential)
    const summary = await ndexClient.getNetworkSummary(uuid)
    summaryMap[uuid] = summary
    return summary
  } catch (e: unknown) {
    throw new NDExError(e['message'], e)
  }
}

export default function useNetworkSummary(
  uuid: string,
  serverUrl: string,
  apiVersion: string = 'v2',
  credential: NdexCredential,
) {
  return useQuery(
    ['networkSummary', uuid, serverUrl, apiVersion, credential],
    () => getNetworkSummary(uuid, serverUrl, apiVersion, credential),
    {
      retry: false,
    },
  )
}
