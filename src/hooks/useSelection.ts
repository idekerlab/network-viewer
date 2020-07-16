import { useState, useEffect } from 'react'

const useSelection = (nodes, edges) => {
  const [selectedNodes, setSelectedNodes] = useState([])
  const [selectedEdges, setSelectedEdges] = useState([])

  useEffect(() => {
    setSelectedNodes(nodes)
    setSelectedEdges(edges)
  }, [nodes, edges])

  return {
    nodes, edges
  } 
}

export default useSelection
