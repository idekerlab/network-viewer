import { useQuery } from 'react-query'
import HttpResponse from '../api/HttpResponse'
import NdexCredential from '../model/NdexCredential'
import { getAuthorization } from '../utils/credentialUtil'

import { useState, useEffect } from 'react'

const DEF_MAX_EDGE = 10000

const edgeLimitParams = {
  edgeLimit: DEF_MAX_EDGE,
  errorWhenLimitIsOver: true,
}

const queryModeParams = {
  direct: {
    searchDepth: 1,
  },
  firstStepNeighborhood: {
    directOnly: false,
    searchDepth: 1,
  },
  firstStepAdjacent: {
    directOnly: true,
    searchDepth: 1,
  },
  interconnect: {
    searchDepth: 2,
  },
  twoStepNeighborhood: {
    directOnly: false,
    searchDepth: 2,
  },
  twoStepAdjacent: {
    directOnly: true,
    searchDepth: 2,
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

const isEdgeLimitExceeded = (cx) => {
  for (let tag in cx) {
    const value = cx[tag]
    const status = value['status']
    if (status && status.length > 0) {
      if (status[0].success) {
        return false
      } else {
        return status[0].error === 'EdgeLimitExceeded'
      }
    }
  }
}

export const saveQuery = async (
  uuid: string,
  query: string,
  serverUrl: string,
  credential: NdexCredential,
  mode: string,
) => {
  if (uuid === undefined || uuid === null || uuid.length === 0) {
    return {}
  }

  if (query === undefined || query === null || query.length === 0) {
    return {}
  }

  let url = `${serverUrl}/v2/search/network/${uuid}/query?save=true`
  if (mode === 'interconnect' || mode === 'direct') {
    url = `${serverUrl}/v2/search/network/${uuid}/interconnectquery?save=true`
  }

  const queryParam = queryModeParams[mode]
  queryParam['searchString'] = query

  const authorization = getAuthorization(credential)

  const settings = {
    method: 'POST',
    // mode: 'cors',
    headers: authorization
      ? {
          'Content-Type': 'application/json',
          Authorization: authorization,
        }
      : {
          'Content-Type': 'application/json',
        },
    body: JSON.stringify(queryParam),
  }

  return fetch(url, settings)
}

const queryNetwork = async <T>(
  _,
  uuid: string,
  query: string,
  serverUrl: string,
  credential: NdexCredential,
  mode: string,
  maxEdge: number,
) => {
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

  edgeLimitParams['edgeLimit'] = maxEdge
  const queryParam = Object.assign(Object.assign({}, queryModeParams[mode], edgeLimitParams))
  queryParam['searchString'] = query

  const authorization = getAuthorization(credential)

  const settings = {
    method: 'POST',
    // mode: 'cors',
    headers: authorization
      ? {
          'Content-Type': 'application/json',
          Authorization: authorization,
        }
      : {
          'Content-Type': 'application/json',
        },
    body: JSON.stringify(queryParam),
  }

  const response: HttpResponse<object> = await fetch(url, settings)

  try {
    const cx = await response.json()
    const edgeLimitExceeded = isEdgeLimitExceeded(cx)
    response.parsedBody = {
      nodeIds: selectNodes(cx),
      kvMap: transformCx(cx),
      // subNetwork: cx2cyjs(uuid, cx),
      cx,
      edgeLimitExceeded,
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

const useSearch = (
  uuid: string,
  query: string,
  serverUrl: string,
  credential: NdexCredential,
  mode: string,
  maxEdge: number,
) => {
  // Make this hook stateful to avoid multiple calls
  const [enabled, setEnabled] = useState(false)
  const [last, setLast] = useState(null)

  useEffect(() => {
    const nextQuery = {
      uuid,
      query,
      mode,
    }

    if (nextQuery === last) {
      setEnabled(false)
    } else {
      if (nextQuery === null || query === '') {
        setEnabled(false)
      } else {
        setEnabled(true)
      }
      setLast(nextQuery)
    }

    return () => {}
  }, [uuid, query, mode])

  return useQuery(['queryNetwork', uuid, query, serverUrl, credential, mode, maxEdge], queryNetwork, {
    enabled: enabled,
    cacheTime: 1000
  })
}

export default useSearch
