import { useQuery } from 'react-query'
import NdexCredential from '../model/NdexCredential'
import { getAccessKey, getNdexClient } from '../utils/credentialUtil'
import NDExError from '../utils/error/NDExError'

import { useLocation } from 'react-router-dom'
import { useContext } from 'react'
import KeycloakContext from '../context/KeycloakContext'

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
    let summary = null
    if (credential.accesskey !== undefined && credential.accesskey !== '') {
      summary = await ndexClient.getNetworkSummary(uuid, credential.accesskey)
    } else {
      summary = await ndexClient.getNetworkSummary(uuid)
    }
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
  const { client } = useContext(KeycloakContext)
  // const accessToken: string = client.token
  const location = useLocation()
  const accessKey: string = getAccessKey(location.search)
  if (accessKey !== null) {
    credential.accesskey = accessKey
  }

  return useQuery(
    ['networkSummary', uuid, serverUrl, apiVersion, credential],
    () => getNetworkSummary(uuid, serverUrl, apiVersion, credential),
    {
      retry: false,
    },
  )
}
