import React, { useRef, useEffect, useState } from 'react'
import { createCytoscape } from './create-cytoscape'

const ROOT_STYLE = {
  width: '100%',
  height: '100%',
}

/**
 *
 * @param props Minimal wrapper for Cytoscape.js
 * Cytoscape.js instance should be injected as a parameter
 *
 *
 */
const CytoscapeRenderer = (props) => {
  const cyEl = useRef(null)
  const [cy, setCy] = useState(null)

  const { network, visualStyle, eventHandlers, selected } = props
  let elements = []

  useEffect(() => {
    if (network !== undefined && network !== null) {
      console.log('------- Adding elements ------------', props)
      elements = network.elements
      cy.add(elements)
      cy.style().fromJson(visualStyle).update()
      cy.fit()
    }
  }, [network])

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
    let selectionStr = selected.join(', #')

    if(selectionStr.length === 0) {
      return
    }
    
    selectionStr = '#' + selectionStr

    if (cy !== null) {
      const selectedElements = cy.$(selectionStr)
      console.log('------- Selected ELM ------------', selectedElements)
      selectedElements.select()
    }
  }, [selected])

  return <div style={ROOT_STYLE} ref={cyEl} />
}

const initializeCy = (cy, eventHandlers) => {
  cy.on('tap, click', (event) => {
    const evtTarget = event.target

    if (evtTarget === cy) {
      console.log('* tap on background')
      eventHandlers.setSelectedEdges([])
      eventHandlers.setSelectedNodes([])
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
