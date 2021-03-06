import { useQuery } from 'react-query'
import NdexCredential from '../model/NdexCredential'

import { getNdexClient } from '../utils/credentialUtil'

const permissionsMap = {}

const getNetworkPermissions = async <T>(
  _,
  uuid: string,
  serverUrl: string,
  apiVersion: string,
  credential: NdexCredential
) => {
  const cache = permissionsMap[uuid]

  if(cache !== undefined) {
    return cache
  }

  if (!credential.loaded || !credential.isLogin) {
    return undefined
  }

  const ndexClient = getNdexClient(`${serverUrl}/v2`, credential)
  const permissions = await ndexClient.getNetworkPermissionsByUUIDs([uuid])
  const networkPermission = permissions[uuid];
  permissionsMap[uuid] = networkPermission

  return networkPermission
}

export default function useNetworkPermissions(
  uuid: string,
  serverUrl: string,
  apiVersion: string = 'v2',
  credential: NdexCredential,
) {
  return useQuery(['networkPermissions', uuid, serverUrl, apiVersion, credential], getNetworkPermissions)
}
