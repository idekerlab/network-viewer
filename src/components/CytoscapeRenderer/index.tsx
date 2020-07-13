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

  const network = props.network
  let elements = []

  useEffect(() => {
    if (network !== undefined && network !== null) {
      console.log('------- Adding elements ------------', network)
      elements = network.elements
      cy.add(elements)
      cy.fit()
    }
  }, [network])

  useEffect(() => {
    // Create new instance of Cytoscape when element is available
    if (cy === null && cyEl !== null && cyEl.current !== null) {
      const cyjs = createCytoscape(cyEl.current)
      initializeCy(cyjs)
      setCy(cyjs)
      console.log('Cytoscape.js instance created', cyEl, cyjs)
    }
  }, [cyEl])

  return <div style={ROOT_STYLE} ref={cyEl} />
}

const initializeCy = (cy) => {
  cy.on('tap, click', (event) => {
    const evtTarget = event.target

    if (evtTarget === cy) {
      console.log('* tap on background')
    } else {
      console.log('* tap on some element', evtTarget)
    }
  })
}

export default CytoscapeRenderer
