import React, { useRef, useEffect, useState, Children } from 'react'
import { createCytoscape } from './create-cytoscape'
import useCyjs from '../../hooks/useCyjs'
import Loading from '../NetworkPanel/Loading'

// Style for the network canvas area
const ROOT_STYLE = {
  width: '100%',
  height: '100%',
}

const CytoscapeRenderer = (props) => {
  const cyEl = useRef(null)
  const [cyInstance, setCyInstance] = useState(null)

  const { uuid, cx, eventHandlers, layoutName, setCyReference, setBusy } = props
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
          console.log('CyInstance --------------- Layout done!!')
        },
      })
      layout.run()
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
      console.log('#CYEL ############### Cytoscape.js instance created #', newCyInstance)
    }
  }, [cyEl])

  return <div style={ROOT_STYLE} ref={cyEl} />
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

    eventHandlers.setLastSelectedFrom(undefined, event)
    eventHandlers.setSelectedNodes(nodeIds)
    eventHandlers.setSelectedEdges(edgeIds)
    console.log('selection done!!!!!!!!', performance.now() - t0)
  }, 5)
}
const tapHandler = (cy, eventHandlers, event) => {
  console.log('**********tap:', event)
  const evtTarget = event.target
  const t0 = performance.now()

  if (evtTarget === cy) {
    console.log('* tap on background2')

    setTimeout(() => {
      eventHandlers.setSelectedEdges([])
      eventHandlers.setSelectedNodes([])
      eventHandlers.setLastSelectedNode([])
      eventHandlers.setLastSelectedEdge([])
    }, 10)
    // cy.elements().removeClass('faded')
    // cy.elements().removeClass('highlight')
  } else {
    const data = evtTarget.data()

    if (evtTarget.isNode()) {
      console.log('* tap on Node', evtTarget.data())
      // Clear last one first
      //eventHandlers.setSelectedEdges([])
      //eventHandlers.setSelectedNodes([data.id], event)
      setTimeout(() => {
        const selectedNodes = cy.$('node:selected')
        const selectedEdges = cy.$('edge:selected')
        const nodeIds = selectedNodes.map((node) => node.data().id)
        const edgeIds = selectedEdges.map((edge) => edge.data().id.slice(1))
        eventHandlers.setSelectedEdges(edgeIds)
        eventHandlers.setSelectedNodes(nodeIds, event)
        eventHandlers.setLastSelectedNode([data.id], event)
      }, 5)
    } else {
      console.log('* tap on Edge', evtTarget.data())
      //eventHandlers.setSelectedNodes([])
      //eventHandlers.setSelectedEdges([data.id.slice(1)], event)
      setTimeout(() => {
        const selectedNodes = cy.$('node:selected')
        const selectedEdges = cy.$('edge:selected')
        const nodeIds = selectedNodes.map((node) => node.data().id)
        const edgeIds = selectedEdges.map((edge) => edge.data().id.slice(1))
        eventHandlers.setSelectedEdges(edgeIds)
        eventHandlers.setSelectedNodes(nodeIds, event)
        eventHandlers.setLastSelectedEdge([data.id.slice(1)], event)
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
    cy.fit()
    // cy.userPanningEnabled(false)
    // cy.elements().unselectify()
    // cy.nodes().ungrabify()
  }
}

export default CytoscapeRenderer
