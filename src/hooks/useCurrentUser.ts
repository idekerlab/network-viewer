import { useQuery } from 'react-query'
import NdexCredential from '../model/NdexCredential'

import { getNdexClient } from '../utils/credentialUtil'
import NDExError from '../utils/error/NDExError'

const getCurrentUser = async (
  serverUrl: string,
  apiVersion: string,
  credential: NdexCredential,
) => {
  if (credential === undefined || (credential.accessKey === undefined && credential.idToken === undefined)) {
    return undefined
  }

  const url = `${serverUrl}/${apiVersion}`

  let currentUser = undefined
  try {
    const ndexClient = getNdexClient(url, credential)
    currentUser = await ndexClient.getSignedInUser()
  } catch (e: unknown) {
    throw new NDExError(e['message'], e)
  }

  return currentUser
}

export default function useCurrentUser(
  serverUrl: string,
  apiVersion: string = 'v2',
  credential: NdexCredential,
) {
  return useQuery(
    ['currentUser', serverUrl, apiVersion, credential],
    () => getCurrentUser(serverUrl, apiVersion, credential),
    {
      retry: false,
    },
  )
}
