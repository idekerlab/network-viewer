import { useQuery } from 'react-query'
import NdexCredential from '../model/NdexCredential'
import { getNdexClient } from '../utils/credentialUtil'

const summaryMap = {}

async function getNetworkSummary (
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
  const ndexClient = getNdexClient(ndexUrl, credential)
  try {
    let summary = await ndexClient.getNetworkSummary(uuid)
    summaryMap[uuid] = summary

    return summary
  } catch(e) {
    console.warn('Failed to fetch summary', e)
    throw new Error(e)
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
    async () => getNetworkSummary(uuid, serverUrl, apiVersion, credential),
    {
      retry: false
      // onError: (e) => {
      //   console.error('* Fetch summary error:', e)
      // },
    },
  )
}
