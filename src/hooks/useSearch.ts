import { useQuery } from 'react-query'
import HttpResponse from '../api/HttpResponse'

const URL = 'http://dev.ndexbio.org/v2/search/network/'

const EDGE_LIMIT = 5000

const queryModeParams = {
  direct: {
    directOnly: true,
    edgeLimit: EDGE_LIMIT
  },
  firstStepNeighborhood: {
    directOnly: false,
    searchDepth: 1,
    edgeLimit: EDGE_LIMIT
  },
  firstStepAdjacent: {
    edgeLimit: EDGE_LIMIT,
    directOnly: true,
    searchDepth: 1,
  },
  interconnect: {
    edgeLimit: EDGE_LIMIT,
    searchDepth: 1
  },
  twoStepNeighborhood: {
    edgeLimit: EDGE_LIMIT,
    directOnly: false,
    searchDepth: 2,
  },
  twoStepAdjacent: {
    edgeLimit: EDGE_LIMIT,
    directOnly: true,
    searchDepth: 2,
  },
}

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

const queryNetwork = async <T>(_, uuid: string, query: string, serverUrl: string, mode: string) => {
  if (uuid === undefined || uuid === null || uuid.length === 0) {
    // throw new Error('UUID is required')
    return {}
  }
  
  if (query === undefined || query === null || query.length === 0) {
    return {}
  }

  console.log('##############################Calling search: ', mode, query, uuid)
  let url = `${URL}${uuid}/query`
  if(mode === 'interconnect') {
    url = `${URL}${uuid}/interconnectquery`
  }

  const queryParam = queryModeParams[mode]
  queryParam['searchString'] = query

  const settings = {
    method: 'POST',
    // mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(queryParam),
  }

  console.log('Calling search settings: ', settings)
  const response: HttpResponse<object> = await fetch(url, settings)

  console.log('Calling search res---------------->: ', response)
  try {
    const cx = await response.json()
    console.log('Calling search CX---------------->: ', cx, )
    response.parsedBody = {
      nodeIds: selectNodes(cx),
      kvMap: transformCx(cx),
      // subNetwork: cx2cyjs(uuid, cx),
      cx,
    }

    console.log('Search called: result2++++++++', mode, queryParam, url, response.parsedBody)
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
    if(current === undefined) {
      current = new Map()
    }
    current.set('name', val)
    id2attr[id] = current
  }

  return id2attr
}

const useSearch = ( uuid: string, query: string, serverUrl: string, mode: string) => {
  return useQuery(['queryNetwork', uuid, query, serverUrl, mode], queryNetwork)
}

const updateSelectionState = (data: object, setSelection: Function) => {
  // setSelection(data)
}

export default useSearch
