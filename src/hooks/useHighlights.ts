import { useState } from 'react'
import { getEntry } from '../utils/cxUtil'


const useHighlight = (query: string, mode: string, cx: object[]) => {

  // Highlight object
  const [highlight, setHighlight] = useState(null)
  const [isRunning, setIsRunning] = useState(false)

  const [searchId, setSearchId] = useState(null)
  
  if (cx === undefined || cx === null || cx === []) {
    return null
  }

  if(query === '' || query === null) {
    // Clear result if query is cleared
    setHighlight(null)
    setSearchId(null)
    return null
  }

  if (isRunning) {
    // Processing and not ready yet
    return null
  }


  const searchState = query + '-' + mode
  if(searchId !== null && searchState === searchId) {
    
    return highlight
  }

  setSearchId(searchState)
  setIsRunning(true)

  console.log('Highlight computation start', isRunning, searchState, highlight)

  const nodes = getEntry('nodes', cx)
  const edges = getEntry('edges', cx)
  const nodeAttr = getEntry('nodeAttributes', cx)

  const queryNodes = []
  let len = nodeAttr.length
  while (len--) {
    const entry = nodeAttr[len]
    const tag = entry['n']
    const val = !!entry['v']
    if (tag === 'querynode' && val) {
      const pointer = entry['po']
      queryNodes.push(pointer)
    }
  }

  const nodeIds: string[] = nodes.map((node: object) => node['@id'])
  const edgeIds: string[] = edges.map((edge: object) => edge['@id'])

  const selected = { nodeIds, edgeIds, queryNodes }
  setHighlight(selected)
  setIsRunning(false)
  return selected
}

export default useHighlight
