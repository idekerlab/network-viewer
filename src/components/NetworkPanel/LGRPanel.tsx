import React, { useState, useEffect } from 'react'
import { NodeView, EdgeView, GraphView, GraphViewFactory, LargeGraphRenderer } from 'large-graph-renderer'

import * as cxVizConverter from 'cx-viz-converter'
import Loading from './Loading'

type LGRPanelProps = {
  eventHandlers: EventHandlers
  selectedNodes: string[]
  selectedEdges: string[]
  // highlight: object
  cx: object[]
  backgroundColor: string
}

export type EventHandlers = {
  setSelectedNodes: Function
  setSelectedEdges: Function
  setLastSelectedNode: Function
  setLastSelectedEdge: Function
}

const LGRPanel = ({ eventHandlers, selectedNodes, selectedEdges, cx, backgroundColor = '#FFFFFF' }: LGRPanelProps) => {
  const [render3d, setRender3d] = useState(false)
  const [painted, setPainted] = useState(false)
  const [data, setData] = useState<GraphView | null>(null)

  // TODO: support multiple selection
  const _handleNodeClick = (selectedNodeEvent: NodeView, x: number, y: number): void => {
    console.log('* Node click event:', selectedNodeEvent)
    if (selectedNodes.length !== 0) {
      selectedNodes.forEach((nodeId) => {
        const lastSelectedNode = data.nodeViews.get(nodeId)
        lastSelectedNode.selected = false
        console.log('Clear selection:', lastSelectedNode)
      })
    }
    const nodeId: string = selectedNodeEvent.id
    eventHandlers.setSelectedNodes([nodeId])
    eventHandlers.setSelectedEdges([])
    eventHandlers.setLastSelectedNode([nodeId], { renderedPosition: { x: x, y: y } })
  }

  const _handleEdgeClick = (selectedEdgeEvent: EdgeView, x: number, y: number): void => {
    console.log('* Edge click event:', selectedEdgeEvent)
    if (selectedEdges.length !== 0) {
      selectedEdges.forEach((edgeId) => {
        const lastSelectedEdge = data.edgeViews.get(edgeId)
        lastSelectedEdge.selected = false
        console.log('Clear edge selection:', lastSelectedEdge)
      })
    }
    const edgeId: string = selectedEdgeEvent.id
    eventHandlers.setSelectedEdges([edgeId])
    eventHandlers.setSelectedNodes([])
    eventHandlers.setLastSelectedEdge([edgeId], { renderedPosition: { x: x, y: y } })
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

  useEffect(() => {
    if (cx !== undefined && data === null) {
      const result = cxVizConverter.convert(cx, 'lnv')
      const gv = GraphViewFactory.createGraphView(result.nodeViews, result.edgeViews)
      setData(gv)
    }
  }, [cx])

  // useEffect(() => {
  //   console.log('---------Highlight changed', highlight, data)

  //   if (highlight === undefined && highlight === null && Object.keys(highlight).length === 0) {
  //     return
  //   }

  //   if (highlight !== null && !painted) {
  //     applyHighlight(highlight, data)
  //     setPainted(true)
  //     console.log('--------------------------- color on!!', highlight, data)
  //   } else if (highlight === null && painted) {
  //     console.log('-------CLEAR start!!', highlight, data)
  //     clearHighlight(data)
  //     setPainted(false)
  //   }
  // }, [highlight])

  if (data === null || data === undefined) {
    const loadingMessage = 'Loading large network data.  Please wait......'
    return <Loading message={loadingMessage} />
  }

  return (
    <LargeGraphRenderer
      graphView={data}
      onNodeClick={_handleNodeClick}
      onEdgeClick={_handleEdgeClick}
      onBackgroundClick={_handleBackgroundClick}
      render3d={render3d}
      backgroundColor={backgroundColor}
    />
  )
}

const applyHighlight = (highlight, data) => {
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
        nv.color = [255, 0, 0, 255]
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
}

const clearHighlight = (data) => {
  const nodeViews = data.nodeViews
  for (let entry of nodeViews) {
    const nv: NodeView = entry[1]
    nv.color = [255, 255, 255, 255]
  }

  const edgeViews = data.edgeViews
  for (let entry of edgeViews) {
    const ev: EdgeView = entry[1]
    ev.color = [155, 155, 155, 200]
  }
}

export default LGRPanel
