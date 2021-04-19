import { useQuery } from 'react-query'
import NdexCredential from '../model/NdexCredential'

import { getNdexClient } from '../utils/credentialUtil'
import NDExError from '../utils/error/NDExError'

const permissionsMap = {}

const getNetworkPermissions = async (
  uuid: string,
  serverUrl: string,
  apiVersion: string,
  credential: NdexCredential,
) => {
  const cache = permissionsMap[uuid]

  if (cache !== undefined) {
    return cache
  }

  if (credential === undefined || !credential.loaded || !credential.isLogin) {
    return undefined
  }

  const url = `${serverUrl}/${apiVersion}`
  let networkPermission = null
  
  try {
    const ndexClient = getNdexClient(url, credential)
    const permissions = await ndexClient.getNetworkPermissionsByUUIDs([uuid])
    const networkPermission = permissions[uuid]
    permissionsMap[uuid] = networkPermission
  } catch (e: unknown) {
    throw new NDExError(e['message'], e)
  }

  return networkPermission
}

export default function useNetworkPermissions(
  uuid: string,
  serverUrl: string,
  apiVersion: string = 'v2',
  credential: NdexCredential,
) {
  return useQuery(
    ['networkPermissions', uuid, serverUrl, apiVersion, credential],
    () => getNetworkPermissions(uuid, serverUrl, apiVersion, credential),
    {
      retry: false,
    },
  )
}
