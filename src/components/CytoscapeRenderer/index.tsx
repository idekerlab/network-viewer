import React, { useRef, useEffect, useState } from 'react'
import { createCytoscape } from './create-cytoscape'

// Style for the network canvas area
const ROOT_STYLE = {
  width: '100%',
  height: '100%',
}

const CytoscapeRenderer = (props) => {
  const cyEl = useRef(null)
  const [cy, setCy] = useState(null)

  const { network, visualStyle, eventHandlers, selectedNodes, selectedEdges } = props
  let elements = []

  useEffect(() => {
    if (network !== undefined && network !== null) {
      console.log('------- Adding elements ------------', props)
      elements = network.elements
      cy.add(elements)

      const newVS = addExtraStyle(visualStyle)

      cy.style().fromJson(newVS).update()
      cy.fit()
    }
  }, [network])

  const addExtraStyle = visualStyle => {
    const faded = {
      selector: '.faded',
      css: {
        'background-opacity': 0.1,
        'text-opacity': 0.1,
        'border-opacity': 0.1,
      }
    }
    
    const highlight = {
      selector: '.highlight',
      css: {
        'background-opacity': 1,
        'text-opacity': 1,
        'border-opacity': 1,
      }
    }

    visualStyle.push(faded)
    visualStyle.push(highlight)

    return visualStyle

  }

  useEffect(() => {
    // Create new instance of Cytoscape when element is available
    if (cy === null && cyEl !== null && cyEl.current !== null) {
      const cyjs = createCytoscape(cyEl.current)
      initializeCy(cyjs, eventHandlers)
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

const initializeCy = (cy, eventHandlers) => {
  cy.on('tap, click', (event) => {
    const evtTarget = event.target

    if (evtTarget === cy) {
      console.log('* tap on background')
      eventHandlers.setSelectedEdges([])
      eventHandlers.setSelectedNodes([])
      cy.elements().removeClass('faded');
      cy.elements().removeClass('highlight');
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
}

export default CytoscapeRenderer
