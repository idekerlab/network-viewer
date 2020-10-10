import React, { useState, useEffect } from 'react'
import { NodeView, EdgeView, GraphView, GraphViewFactory, LargeGraphRenderer } from 'large-graph-renderer'

import * as cxVizConverter from 'cx-viz-converter'
import Loading from './Loading'
import { getEntry } from '../../utils/cxUtil'

type LGRPanelProps = {
  eventHandlers: EventHandlers
  selectedNodes: string[]
  selectedEdges: string[]
  // highlight: object
  cx: object[]
  backgroundColor: string
  layoutName?: string
  pickable?: boolean
}

export type EventHandlers = {
  setSelectedNodeOrEdge: Function
  clearAll: Function
}

const LGRPanel = ({
  eventHandlers,
  selectedNodes,
  selectedEdges,
  cx,
  backgroundColor = '#FFFFFF',
  layoutName = 'preset',
  pickable,
}: LGRPanelProps) => {
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

    eventHandlers.setSelectedNodeOrEdge(nodeId, 'node', { x: x, y: y })
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
    eventHandlers.setSelectedNodeOrEdge(edgeId, 'edge', { x: x, y: y })
  }

  const _handleBackgroundClick = (event: object): void => {
    clearSelection()
    eventHandlers.clearAll()
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
    eventHandlers.clearAll()
  }

  useEffect(() => {
    if (cx !== undefined && data === null) {
      const result = cxVizConverter.convert(cx, 'lnv')

      // TODO: add better layout
      let { nodeViews, edgeViews } = result
      if (layoutName !== 'preset') {
        nodeViews = randomCircularLayout(nodeViews)
      }

      if (edgeViews !== undefined) {
        const edges = getEntry('edges', cx)
        edgeViews = createLayers(edgeViews, edges)
      }
      const gv = GraphViewFactory.createGraphView(nodeViews, result.edgeViews)
      setData(gv)
    }
  }, [cx])

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
      pickable={pickable}
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

const randomCircularLayout = (nodeViews: NodeView[]): NodeView[] => {
  let idx = nodeViews.length
  const scalingFactor = 4000 // TODO: compute from viewport

  while (idx--) {
    const nv: NodeView = nodeViews[idx]

    const t = 2 * Math.PI * Math.random()
    const u = Math.random() + Math.random()
    let r = 0
    if (u > 1) {
      r = 2 - u
    } else {
      r = u
    }
    const x = r * Math.cos(t) * scalingFactor
    const y = r * Math.sin(t) * scalingFactor
    nv.position = [x, y]
  }
  return nodeViews
}

const createLayers = (edgeViews: EdgeView[], edges: object[]): EdgeView[] => {
  let edgeIdx = edges.length

  const id2weight = []
  while (edgeIdx--) {
    const e = edges[edgeIdx]
    const v = e['v']
    if (v !== undefined && v.weight !== undefined) {
      id2weight.push([e['id'], v.weight])
    }
  }

  id2weight.sort((a, b) => b[1] - a[1])

  let idx = edgeViews.length
  const id2ev: Map<string, EdgeView> = new Map()
  while (idx--) {
    const ev = edgeViews[idx]
    id2ev.set(ev.id, ev)
  }
  let size = id2weight.length
  const topEdges = 100000
  for(let i = 0; i < size; i++) {
    const id = id2weight[i][0].toString()
    const ev = id2ev.get(id)

    if(i < topEdges) {
      ev['layer'] = 1
    } else {
      ev['layer'] = 2

    }
  }

  return edgeViews
}

export default LGRPanel
