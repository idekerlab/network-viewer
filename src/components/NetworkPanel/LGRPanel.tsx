import React, { useState, useEffect } from 'react'
import { NodeView, EdgeView, GraphView, GraphViewFactory, LargeGraphRenderer } from 'large-graph-renderer'

import * as cxVizConverter from 'cx-viz-converter'
import Loading from './Loading'

// For deployment
const BASE_URL = 'http://dev.ndexbio.org/v3/network/'

const emptyNodes = new Map<string, NodeView>()
const emptyEdges = new Map<string, EdgeView>()

const rootStyle = {
  width: '100%',
  height: '100%',
}

const LGRPanel = (props) => {
  const { eventHandlers } = props

  const [render3d, setRender3d] = useState(false)
  const [data, setData] = useState<GraphView | null>(null)
  const [loading, setLoading] = useState(false)

  // TODO: support multiple selection
  const _handleNodeClick = (selectedNode: NodeView): void => {
    console.log('################ Node click event:', selectedNode)
    const nodeId: string = selectedNode.id
    eventHandlers.setSelectedNodes([nodeId])
  }

  const _handleEdgeClick = (selectedEdge: EdgeView): void => {
    console.log('!!!!!!!!!!!! ext Edge click event:', selectedEdge)
    const edgeId = selectedEdge.id
    // setSelectedNode(node)
  }

  const _handleBackgroundClick = (event: object): void => {
    console.log('injected !!!!!!!!!!!! BG click event:', event)
  }

  const { network, cx } = props

  useEffect(() => {
    if (cx !== undefined && data === null) {
      setLoading(true)
      const result = cxVizConverter.convert(cx, 'lnv')
      const gv = GraphViewFactory.createGraphView(result.nodeViews, result.edgeViews)
      setData(gv)
      setLoading(false)
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
    />
  )
}

export default LGRPanel
