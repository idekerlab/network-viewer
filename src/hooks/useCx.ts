import { useQuery } from 'react-query'
import NdexCredential from '../model/NdexCredential'
import { getNdexClient } from '../utils/credentialUtil'

const getCx = async <T>(_, uuid: string, serverUrl: string, apiVersion: string, credential: NdexCredential) => {
  if (apiVersion === null) {
    throw new Error('No API version')
  }


  const ndexClient = getNdexClient(`${serverUrl}${apiVersion}`, credential)
  const cx = await ndexClient.getRawNetwork(uuid)
  return cx
}

export default function useCx(uuid: string, serverUrl: string, apiVersion: string, credential: NdexCredential) {
  return useQuery(['cx', uuid, serverUrl, apiVersion, credential], getCx)
}
