import React, { useState, useEffect } from 'react'
import { NodeView, EdgeView, GraphView, GraphViewFactory, LargeGraphRenderer } from 'large-graph-renderer'

import * as cxVizConverter from 'cx-viz-converter'
import Loading from './Loading'

const LGRPanel = (props) => {
  const { eventHandlers, selectedNodes, selectedEdges, highlight } = props

  const [render3d, setRender3d] = useState(false)
  const [isHighlight, setIsHighlight] = useState(false)
  const [painted, setPainted] = useState(false)
  const [data, setData] = useState<GraphView | null>(null)
  const [loading, setLoading] = useState(false)

  // TODO: support multiple selection
  const _handleNodeClick = (selectedNode: NodeView): void => {
    console.log('* Node click event:', selectedNode)
    if (selectedNodes.length !== 0) {
      selectedNodes.forEach((nodeId) => {
        const lastSelectedNode = data.nodeViews.get(nodeId)
        lastSelectedNode.selected = false
        console.log('Clear selection:', lastSelectedNode)
      })
    }
    const nodeId: string = selectedNode.id
    eventHandlers.setSelectedNodes([nodeId])
  }

  const _handleEdgeClick = (selectedEdge: EdgeView): void => {
    console.log('* Edge click event:', selectedEdge)
    if (selectedEdges.length !== 0) {
      selectedEdges.forEach((edgeId) => {
        const lastSelectedEdge = data.edgeViews.get(edgeId)
        lastSelectedEdge.selected = false
        console.log('Clear edge selection:', lastSelectedEdge)
      })
    }
    const edgeId: string = selectedEdge.id
    eventHandlers.setSelectedEdges([edgeId])
  }

  const _handleBackgroundClick = (event: object): void => {
    clearSelection()
    console.log('Reset election:', selectedNodes, selectedEdges)
  }

  const clearSelection = () => {
    selectedNodes.forEach((nodeId) => {
      const lastSelectedNode = data.nodeViews.get(nodeId)
      lastSelectedNode.selected = false
      console.log('Clear Node selection:', lastSelectedNode)
    })
    selectedEdges.forEach((edgeId) => {
      const lastSelectedEdge = data.edgeViews.get(edgeId)
      lastSelectedEdge.selected = false
      console.log('Clear edge selection:', lastSelectedEdge)
    })
    eventHandlers.setSelectedNodes([])
    eventHandlers.setSelectedEdges([])
  }

  const { cx } = props

  useEffect(() => {
    if (cx !== undefined && data === null) {
      setLoading(true)
      const result = cxVizConverter.convert(cx, 'lnv')
      const gv = GraphViewFactory.createGraphView(result.nodeViews, result.edgeViews)
      setData(gv)
      setLoading(false)
    }
  }, [cx])

  useEffect(() => {
    if (highlight !== undefined && highlight !== null && Object.keys(highlight).length !== 0) {
      setIsHighlight(true)
      console.log('--------------------------- color on!!', highlight, data)
    }
  }, [highlight])

  if (data === null || data === undefined) {
    const loadingMessage = 'Loading large network data.  Please wait......'
    return <Loading message={loadingMessage} />
  }

  if (isHighlight && !painted) {
    const { nodeIds, edgeIds, queryNodes } = highlight

    const qSet = new Set(queryNodes)
    const nSet = new Set(nodeIds)
    const nodeViews = data.nodeViews
    let len = nodeViews.size
    for (let entry of nodeViews) {
      const nv: NodeView = entry[1]
      const id = entry[0]

      if (nSet.has(Number.parseInt(id))) {
        nv.color = [255, 255, 0]
        nv.size = nv.size * 1.5
        if (qSet.has(Number.parseInt(id))) {
          nv.color= [255, 0, 0, 255]
          nv.size = nv.size * 2.2
        }
      } else {
        nv.color = [155, 155, 155, 8]
      }
    }

    const eSet = new Set(edgeIds)
    const edgeViews = data.edgeViews
    len = edgeViews.size
    for (let entry of edgeViews) {
      const ev: EdgeView = entry[1]
      const id = entry[0]

      if (eSet.has(Number.parseInt(id))) {
        ev.color = [255, 255, 0]
      } else {
        ev.color = [155, 155, 155, 8]
      }
    }
    setPainted(true)
  }

  return (
    <LargeGraphRenderer
      graphView={data}
      onNodeClick={_handleNodeClick}
      onEdgeClick={_handleEdgeClick}
      onBackgroundClick={_handleBackgroundClick}
      render3d={render3d}
    />
  )
}

export default LGRPanel
