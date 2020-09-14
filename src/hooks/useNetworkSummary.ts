import { useQuery } from 'react-query'
import HttpResponse from '../api/HttpResponse'
import NdexCredential from '../model/NdexCredential'

import { getNdexClient, checkCurrentStatus } from '../utils/credentialUtil'

import * as ndex from 'ndex-client'
import ServerError from '../model/ServerError'

const getNetworkSummary = async <T>(
  _,
  uuid: string,
  serverUrl: string,
  apiVersion: string,
  credential: NdexCredential,
) => {
  const ndexClient = getNdexClient(`${serverUrl}${apiVersion}`, credential)
  const summary = await ndexClient.getNetworkSummary(uuid)
  console.log('#############SUMM2:', summary)
  checkCurrentStatus()

  return summary
}

export default function useNetworkSummary(
  uuid: string,
  serverUrl: string,
  apiVersion: string = 'v2',
  credential: NdexCredential,
) {
  return useQuery(['networkSummary', uuid, serverUrl, apiVersion, credential], getNetworkSummary)
}
