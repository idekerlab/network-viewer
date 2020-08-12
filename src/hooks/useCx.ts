import { useQuery } from 'react-query'
import HttpResponse from '../api/HttpResponse'

const getCx = async <T>(_, uuid: string, serverUrl: string, apiVersion: string) => {
  if (apiVersion === null) {
    throw new Error('No API version')
  }

  let url = `${serverUrl}${apiVersion}/network/${uuid}`
  const response: HttpResponse<T> = await fetch(url)

  try {
    response.parsedBody = await response.json()
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Fetch called:: CX:', uuid, url, response.parsedBody)
  } catch (ex) {
    console.error('API Call error:', ex)
  }

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return response.parsedBody
}

export default function useCx(uuid: string, serverUrl: string, apiVersion: string) {
  return useQuery(['cx', uuid, serverUrl, apiVersion], getCx)
}
