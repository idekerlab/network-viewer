import React, { useState, useEffect } from 'react'
import { NodeView, EdgeView, GraphView, LargeGraphRenderer, GraphViewFactory } from 'large-graph-renderer'

import * as cxVizConverter from 'cx-viz-converter'

// For deployment
const BASE_URL = 'http://dev.ndexbio.org/v3/network/'
// const BASE_URL = 'http://public.ndexbio.org/v2/network/'

const emptyNodes = new Map<string, NodeView>()
const emptyEdges = new Map<string, EdgeView>()

// Medium
const DEF_SUID = '876e7b0d-88a4-11ea-8503-525400c25d22'

// Fan's network
const FAN1 = 'a0a1b030-917a-11ea-be39-525400c25d22'
// const PC2 = '84e9e58b-ab3c-11ea-aaef-0ac135e8bacf'

const rootStyle = {
  width: '100%',
  height: '100%',
  background: '#00FF00',
}

const LGRPanel = (props) => {
  const [selectedNetwork, setSelectedNetwork] = useState(FAN1)
  const [render3d, setRender3d] = useState(false)
  const [data, setData] = useState<GraphView | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedNode, setSelectedNode] = useState()
  const [selectedEdge, setSelectedEdge] = useState()

  console.log('* New UUID:', selectedNetwork)
  console.log('* LGR Props:', props)

  const _handleNodeClick = (event: object): void => {
    console.log('################ Node click event:', event)
    // setSelectedNode(node)
  }

  const _handleEdgeClick = (event: object): void => {
    console.log('!!!!!!!!!!!! ext Edge click event:', event)
    // setSelectedNode(node)
  }

  const _handleBackgroundClick = (event: object): void => {
    console.log('!!!!!!!!!!!! BG click event:', event)
  }

  const dataUrl = BASE_URL + selectedNetwork

  const {network, cx} = props

  useEffect(() => {
    if (cx !== undefined && data === null) {
      setLoading(true)
      const result = cxVizConverter.convert(cx, 'lnv')
      const gv = GraphViewFactory.createGraphView(result.nodeViews, result.edgeViews)
      setData(gv)
      setLoading(false)
      console.log('* +++++++++++++++++++++network available:', cx)
    }
  }, [cx])

  if (data === null || data === undefined) {
    return <div style={rootStyle} />
  }

  console.log('*$$$$$$$$$$$$$$$$$$$$$$$ Network Data converted:', data)

  return (
    <div style={rootStyle}>
      <LargeGraphRenderer
        graphView={data}
        onNodeClick={_handleNodeClick}
        onEdgeClick={_handleEdgeClick}
        onBackgroundClick={_handleBackgroundClick}
        render3d={render3d}
      />
    </div>
  )
}

export default LGRPanel
