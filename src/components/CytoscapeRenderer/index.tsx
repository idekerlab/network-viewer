import React, { useRef, useEffect, useState, Children } from 'react'
import { createCytoscape } from './create-cytoscape'
import useCyjs from '../../hooks/useCyjs'

// Style for the network canvas area

type CytoscapeRendererProps = {
  uuid: string
  cx: object[]
  eventHandlers: object
  layoutName?: string
  setCyReference: Function
  setBusy?: Function
  backgroundColor?: string
}

const CytoscapeRenderer = ({
  uuid,
  cx,
  eventHandlers,
  layoutName,
  setCyReference,
  setBusy,
  backgroundColor,
}: CytoscapeRendererProps) => {
  const cyEl = useRef(null)
  const [cyInstance, setCyInstance] = useState(null)

  let baseStyle = {
    width: '100%',
    height: '100%',
    backgroundColor,
  }

  const cyjsNetwork = useCyjs(uuid, cx)

  useEffect(() => {
    if (cyjsNetwork !== undefined && Object.keys(cyjsNetwork).length === 0) {
      return
    }

    updateNetwork(cyjsNetwork, cyInstance)

    if (cyjsNetwork !== {} && cyInstance !== null) {
      if (layoutName !== undefined && cyInstance !== null) {
        const layout = cyInstance.layout({
          name: layoutName,
          animate: false,
          stop: function () {
            setBusy(false)
          },
        })

        setBusy(true)
        layout.run()
      }
    }
  }, [cyjsNetwork])

  useEffect(() => {
    if (cyjsNetwork !== undefined && Object.keys(cyjsNetwork).length === 0) {
      return
    }

    updateNetwork(cyjsNetwork, cyInstance)

    if (layoutName !== undefined && cyInstance !== null) {
      const layout = cyInstance.layout({
        name: layoutName,
        animate: false,
        stop: function () {
          console.log('Initial layout finished')
        },
      })
      layout.run()
      setTimeout(() => {
        cyInstance.fit()
      }, 500)
    }
  }, [cyInstance])

  useEffect(() => {
    // Create new instance of Cytoscape when element is available
    if (cyInstance === null && cyEl !== null && cyEl.current !== null) {
      const newCyInstance = createCytoscape(cyEl.current)

      // Expose Cyjs instance to other component
      if (setCyReference !== undefined) {
        setCyReference(newCyInstance)
      }
      initializeCy(newCyInstance, eventHandlers)
      setCyInstance(newCyInstance)
    }
  }, [cyEl])

  return <div style={baseStyle} ref={cyEl} />
}

const initializeCy = (cy, eventHandlers) => {
  cy.on('tap, click', (event) => tapHandler(cy, eventHandlers, event))
  cy.on('boxend', (event) => boxSelectHandler(cy, eventHandlers, event))
}

const boxSelectHandler = (cy, eventHandlers, event) => {
  const t0 = performance.now()
  setTimeout(() => {
    const selectedNodes = cy.$('node:selected')
    const selectedEdges = cy.$('edge:selected')
    const nodeIds = selectedNodes.map((node) => node.data().id)
    const edgeIds = selectedEdges.map((edge) => edge.data().id.slice(1))
    eventHandlers.setSelectedNodesAndEdges(nodeIds, edgeIds, null, null, null)
  }, 5)
}
const tapHandler = (cy, eventHandlers, event) => {
  const evtTarget = event.target
  const t0 = performance.now()

  if (evtTarget === cy) {
    console.log('* tap on background2')

    setTimeout(() => {
      eventHandlers.clearAll()
    }, 10)
  } else {
    const data = evtTarget.data()

    if (evtTarget.isNode()) {
      console.log('* tap on Node', evtTarget.data())
      setTimeout(() => {
        const selectedNodes = cy.$('node:selected')
        const selectedEdges = cy.$('edge:selected')
        const nodeIds = selectedNodes.map((node) => node.data().id)
        const edgeIds = selectedEdges.map((edge) => edge.data().id.slice(1))
        eventHandlers.setSelectedNodesAndEdges(nodeIds, edgeIds, 'node', [data.id], event.renderedPosition)
      }, 5)
    } else {
      console.log('* tap on Edge', evtTarget.data())
      setTimeout(() => {
        const selectedNodes = cy.$('node:selected')
        const selectedEdges = cy.$('edge:selected')
        const nodeIds = selectedNodes.map((node) => node.data().id)
        const edgeIds = selectedEdges.map((edge) => edge.data().id.slice(1))
        eventHandlers.setSelectedNodesAndEdges(nodeIds, edgeIds, 'edge', [data.id.slice(1)], event.renderedPosition)
      }, 5)
    }
  }
  console.log('tap clear', performance.now() - t0)
}

const addExtraStyle = (visualStyle) => {
  const faded = {
    selector: '.faded',
    css: {
      'background-opacity': 0.1,
      'text-opacity': 0.1,
      'border-opacity': 0.1,
    },
  }

  const highlight = {
    selector: '.highlight',
    css: {
      'background-opacity': 1,
      'text-opacity': 1,
      'border-opacity': 1,
    },
  }

  visualStyle.push(faded)
  visualStyle.push(highlight)

  return visualStyle
}

const updateNetwork = (cyjs, cy) => {
  const { network } = cyjs
  if (network !== undefined && network !== null && cy !== null) {
    const elements = cyjs.network.elements
    cy.add(elements)

    const newVS = addExtraStyle(cyjs.visualStyle)
    cy.style().fromJson(newVS).update()
  }
}

export default CytoscapeRenderer
