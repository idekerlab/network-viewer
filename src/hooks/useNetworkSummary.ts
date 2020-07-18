import { useQuery } from 'react-query'
import HttpResponse from '../api/HttpResponse'

const getNetworkSummary = async <T>(_, uuid: string, serverUrl: string, apiVersion: string) => {

  let url = `${serverUrl}${apiVersion}/network/${uuid}/summary`
  const response: HttpResponse<T> = await fetch(url)

  try {
    response.parsedBody = await response.json()
  } catch (ex) {
    console.error('API Call error:', ex)
  }
  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return response.parsedBody
}

export default function useNetworkSummary(uuid: string, serverUrl: string, apiVersion: string = 'v2') {
  return useQuery(['networkSummary', uuid, serverUrl, apiVersion], getNetworkSummary)
}
