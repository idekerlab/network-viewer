import React, { useRef, useEffect, useState } from 'react'
import { createCytoscape } from './create-cytoscape'

// Style for the network canvas area
const ROOT_STYLE = {
  width: '100%',
  height: '100%',
}

const CytoscapeRenderer = (props) => {
  const cyEl = useRef(null)

  const { network, visualStyle, eventHandlers, selectedNodes, selectedEdges, setCy, cy } = props
  let elements = []

  useEffect(() => {
    console.log('********************************************UP', props, network)
    if (network !== undefined && network !== null && cy !== null) {
      console.log('------- Adding elements ------------', props)
      elements = network.elements
      console.log('------- !!!!!!!!!!!!!lements22 ------------', elements)
      cy.add(elements)

      const newVS = addExtraStyle(visualStyle)

      cy.style().fromJson(newVS).update()
      cy.fit()
    } else {
      console.log('CANNOT ADD********************************************UP', props)
    }
  }, [network])

  useEffect(() => {
    // Create new instance of Cytoscape when element is available
    if (cy === null && cyEl !== null && cyEl.current !== null) {
      const cyjs = createCytoscape(cyEl.current)
      initializeCy(cyjs, eventHandlers, props)
      setCy(cyjs)
      console.log('Cytoscape.js instance created', cyEl, cyjs)
    }
  }, [cyEl])

  useEffect(() => {
    let selectionStr = selectedNodes.join(', #')

    if (selectionStr.length === 0) {
      return
    }

    selectionStr = '#' + selectionStr

    if (cy !== null) {
      const selectedElements = cy.$(selectionStr)
      console.log('------- Selected ELM ------------', selectedElements)
      cy.nodes().addClass('faded')
      selectedElements.select().addClass('highlight')
    }
  }, [selectedNodes])

  return <div style={ROOT_STYLE} ref={cyEl} />
}

const initializeCy = (cy, eventHandlers, props) => {
  cy.on('tap, click', (event) => {
    const evtTarget = event.target

    if (evtTarget === cy) {
      console.log('* tap on background')
      eventHandlers.setSelectedEdges([])
      eventHandlers.setSelectedNodes([])
      cy.elements().removeClass('faded')
      cy.elements().removeClass('highlight')
    } else {
      const data = evtTarget.data()

      if (evtTarget.isNode()) {
        console.log('* tap on Node', evtTarget.data())
        eventHandlers.setSelectedNodes([data.id])
      } else {
        console.log('* tap on Edge', evtTarget.data())
        eventHandlers.setSelectedEdges([data.id])
      }
    }
  })

  cy.on('resize', (event) => {
    console.log('--------------resize------------', props, cy.elements().size())
    if (cy.elements().size() === 0) {
      const net = props.network
      if (net !== undefined) {
        console.log('------- !!!!!!!!!!!!!lements3 ------------', net)
        cy.add(net.elements)
        var layout = cy.layout({
          name: 'cose'
        });
        
        layout.run();
      }

      // const newVS = addExtraStyle(props.visualStyle)
      // cy.style().fromJson(newVS).update()
    }
    cy.fit()
  })
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

export default CytoscapeRenderer
