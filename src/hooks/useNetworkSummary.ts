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

    if (!isValidSummary(summary)) {
      throw new NDExError(summary.errorMessage, {
        subMessage: 'The entry contains invalid data in summary',
      })
    }

    return summary
  } catch (e: unknown) {
    throw new NDExError(e['message'], e)
  }
}

const isValidSummary = (summary: object): boolean => {
  console.log('Summary:', summary)
  if (summary === undefined || summary === null) {
    return false
  } else if (
    summary['errorMessage'] !== '' &&
    summary['errorMessage'] !== undefined
  ) {
    return false
  }

  return true
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
