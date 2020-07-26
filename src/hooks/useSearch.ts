import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import HttpResponse from '../api/HttpResponse'

import {cx2cyjs} from '../utils/cx2cyjs'


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
  if(uuid === undefined || uuid === '') {
    throw new Error('UUID is required')
  }
  let url = `${URL}${uuid}/query`

  const queryData = {
    searchString: query,
    edgeLimit: 0,
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

  const response: HttpResponse<object> = await fetch(url, settings)

  try {
    const cx = await response.json()
    response.parsedBody = {
      nodeIds: selectNodes(cx),
      kvMap: transformCx(cx),
      subNetwork: cx2cyjs(uuid, cx)
    }

    console.log('Search called: result++++++++', url, response.parsedBody)
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

  if(nodeAttr === undefined) {
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
  while(len--) {
    const n = nodes[len]
    const id = n['@id']
    const val = n['n']
    id2attr[id].set('name', val)
  }

  return id2attr
}

const useSearch = (uuid: string, query: string, serverUrl: string) => {

  const [selection, setSelection] = useState(null)
  const result = useQuery(['queryNetwork', uuid, query, serverUrl], queryNetwork)


  // useEffect(()=> {
  //   if(result === undefined) {
  //     return
  //   }

  //   const {data} = result

  //   if(data === undefined) {
  //     return
  //   }

  //   console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@new data = ', query, data, selection)

  // }, [result.data])

  // updateSelectionState(result.data, setSelection)

  return result
}

const updateSelectionState = (data: object, setSelection: Function) => {

  // setSelection(data)

}

export default useSearch
