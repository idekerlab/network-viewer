import { useState } from 'react'
import { getEntry } from '../utils/cxUtil'

let running = false

const useHighlight = (id: string, cx: object[]) => {
  const [uuid, setUuid] = useState(null)
  const [result, setResult] = useState({})

  console.log('HL start', running)
  if (running) {
    return
  }

  if (cx === undefined || cx === null || cx === []) {
    return {}
  }

  if (uuid === id) {
    return result
  }

  running = true

  const nodes = getEntry('nodes', cx)
  const edges = getEntry('edges', cx)
  const nodeAttr = getEntry('nodeAttributes', cx)

  const queryNodes = []
  let len = nodeAttr.length
  while (len--) {
    const entry = nodeAttr[len]
    // console.log('ATTR node!!!!!!!!!!', entry)
    const tag = entry['n']
    const val = !!entry['v']
    // console.log('ATTR node!!!!!!!!!!', entry, tag, val)
    if (tag === 'querynode' && val) {
      const pointer = entry['po']
      // console.log('Query node!!!!!!!!!!', pointer)
      queryNodes.push(pointer)
    }
  }

  const nodeIds: string[] = nodes.map((node: object) => node['@id'])
  const edgeIds: string[] = edges.map((edge: object) => edge['@id'])

  const selected = { nodeIds, edgeIds, queryNodes }
  setResult(selected)
  setUuid(id)

  console.log('HL updated', selected)
  running = false
  return selected
}

export default useHighlight
