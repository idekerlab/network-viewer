import { useQuery } from 'react-query'
import HttpResponse from '../api/HttpResponse'

import { cx2cyjs } from './cx2cyjs'

const getNetwork = async <T>(_, uuid: string, serverUrl: string, apiVersion: string) => {
  if (apiVersion === null) {
    throw new Error('No API version')
  }
  let url = `${serverUrl}${apiVersion}/network/${uuid}`
  const response: HttpResponse<T> = await fetch(url)

  try {
    response.parsedBody = await response.json()
    console.log('**-------------------NET:', uuid, url, response.parsedBody)
  } catch (ex) {
    console.error('API Call error:', ex)
  }

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return cx2cyjs(uuid, response.parsedBody)
}

export default function useNetwork(uuid: string, serverUrl: string, apiVersion: string) {
  return useQuery(['network', uuid, serverUrl, apiVersion], getNetwork)
}
