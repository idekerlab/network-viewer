import { useQuery } from 'react-query'
import HttpResponse from '../api/HttpResponse'

const URL = 'http://dev.ndexbio.org/v2/search/network/'

const selectNodes = (cxResult: object[]) => {
  let len = cxResult.length
  let nodes = undefined
  while (len--) {
    nodes = cxResult[len]['nodes']
    if (nodes !== undefined) {
      break
    }
  }

  if (nodes === undefined) {
    return []
  }

  const nodeIds = nodes.map((node) => {
    return node['@id']
  })

  return nodeIds
}

const queryNetwork = async <T>(_, uuid: string, query: string, serverUrl: string) => {
  let url = `${URL}${uuid}/query`

  const queryData = {
    searchString: query,
    edgeLimit: 1,
    directOnly: true,
  }

  const settings = {
    method: 'POST',
    // mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(queryData),
  }

  const response: HttpResponse<T> = await fetch(url, settings)

  try {
    const cx = await response.json()
    response.parsedBody = selectNodes(cx) 

    console.log('QUERY called++++++++', url, response.parsedBody)
  } catch (ex) {
    console.error('API Call error:', ex)
  }
  if (!response.ok) {
    throw new Error(response.statusText)
  }


  return response.parsedBody
}


export default function useSearch(uuid: string, query: string, serverUrl: string) {

  return useQuery(['sueryNetwork', uuid, query, serverUrl], queryNetwork)
}
