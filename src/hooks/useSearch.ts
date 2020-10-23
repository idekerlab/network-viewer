import { useQuery } from 'react-query'
import HttpResponse from '../api/HttpResponse'
import NdexCredential from '../model/NdexCredential'
import { getAuthorization } from '../utils/credentialUtil'

const EDGE_LIMIT = 50000

const queryModeParams = {
  direct: {
    searchDepth: 1,
    edgeLimit: EDGE_LIMIT,
    errorWhenLimitIsOver: true
  },
  firstStepNeighborhood: {
    directOnly: false,
    searchDepth: 1,
    edgeLimit: EDGE_LIMIT,
    errorWhenLimitIsOver: true
  },
  firstStepAdjacent: {
    edgeLimit: EDGE_LIMIT,
    directOnly: true,
    searchDepth: 1,
    errorWhenLimitIsOver: true
  },
  interconnect: {
    edgeLimit: EDGE_LIMIT,
    searchDepth: 2,
    errorWhenLimitIsOver: true
  },
  twoStepNeighborhood: {
    edgeLimit: EDGE_LIMIT,
    directOnly: false,
    searchDepth: 2,
    errorWhenLimitIsOver: true
  },
  twoStepAdjacent: {
    edgeLimit: EDGE_LIMIT,
    directOnly: true,
    searchDepth: 2,
    errorWhenLimitIsOver: true
  },
}

const selectNodes = (cxResult: object[]): string[] => {
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

const queryNetwork = async <T>(_, uuid: string, query: string, serverUrl: string, credential: NdexCredential, mode: string) => {
  if (uuid === undefined || uuid === null || uuid.length === 0) {
    return {}
  }

  if (query === undefined || query === null || query.length === 0) {
    return {}
  }

  let url = `${serverUrl}/v2/search/network/${uuid}/query`
  if (mode === 'interconnect' || mode === 'direct') {
    url = `${serverUrl}/v2/search/network/${uuid}/interconnectquery`
  }

  const queryParam = queryModeParams[mode]
  queryParam['searchString'] = query

  const authorization = getAuthorization(credential);

  const settings = {
    method: 'POST',
    // mode: 'cors',  
    headers: authorization
      ? {
        'Content-Type': 'application/json',
        Authorization: authorization
      }
      : {
        'Content-Type': 'application/json'
      }
    ,
    body: JSON.stringify(queryParam),
  }

  console.log('Calling search settings: ', settings)
  const response: HttpResponse<object> = await fetch(url, settings)

  try {
    const cx = await response.json()
    response.parsedBody = {
      nodeIds: selectNodes(cx),
      kvMap: transformCx(cx),
      // subNetwork: cx2cyjs(uuid, cx),
      cx,
    }
  } catch (ex) {
    console.error('Query API Call error:', ex)
  }
  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return response.parsedBody
}

const transformCx = (cx: object[]) => {
  const resultObject = {}

  let len = cx.length
  while (len--) {
    const entry = cx[len]
    const key = Object.keys(entry)[0]
    const value = entry[key]

    resultObject[key] = value
  }
  return getAttrs(resultObject)
}

const getAttrs = (kvMap: object) => {
  const nodeAttr = kvMap['nodeAttributes']
  const nodes = kvMap['nodes']

  const id2attr = {}

  if (nodeAttr === undefined) {
    return id2attr
  }

  let len = nodeAttr.length
  while (len--) {
    const entry = nodeAttr[len]
    const pointer = entry['po']

    let current = id2attr[pointer]
    if (current === undefined) {
      current = new Map()
    }
    current.set(entry['n'], entry['v'])
    id2attr[pointer] = current
  }

  len = nodes.length
  while (len--) {
    const n = nodes[len]
    const id = n['@id']
    const val = n['n']
    let current = id2attr[id]
    if (current === undefined) {
      current = new Map()
    }
    current.set('name', val)
    id2attr[id] = current
  }

  return id2attr
}

const useSearch = (uuid: string, query: string, serverUrl: string, credential: NdexCredential, mode: string) => {
  return useQuery(['queryNetwork', uuid, query, serverUrl, credential, mode], queryNetwork)
}

export default useSearch
