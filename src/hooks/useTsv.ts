import { useQuery } from 'react-query'
import NdexCredential from '../model/NdexCredential'
import { getNdexClient } from '../utils/credentialUtil'

const EMPTY_CX = []

const getTsv = async <T>(_, uuid: string, serverUrl: string, apiVersion: string, credential: NdexCredential) => {
  if (apiVersion === null) {
    // If invalid parameters, just return empty result.
    return EMPTY_CX
  }

  const ndexClient = getNdexClient(`${serverUrl}/${apiVersion}`, credential)
  const cx = await ndexClient.getRawNetwork(uuid)
  return 
}

export default function useTsv(uuid: string, serverUrl: string, apiVersion: string, credential: NdexCredential) {
  return useQuery(['cx', uuid, serverUrl, apiVersion, credential], getTsv)
}
