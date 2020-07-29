import React, { useRef, useEffect, useState } from 'react'
import { createCytoscape } from './create-cytoscape'
import useCyjs from '../../hooks/useCyjs'

// Style for the network canvas area
const ROOT_STYLE = {
  width: '100%',
  height: '100%',
}

const CytoscapeRenderer = (props) => {
  const cyEl = useRef(null)
  const [cyInstance, setCyInstance] = useState(null)

  const { id, uuid, cx, eventHandlers, selectedNodes, selectedEdges, layoutName, options, setCy } = props
  const cyjsNetwork = useCyjs(uuid, cx)

  useEffect(() => {
    updateNetwork(cyjsNetwork, cyInstance)

    if (layoutName !== undefined && cyInstance !== null) {
      const layout = cyInstance.layout({
        name: 'cose',
        animate: false
      })
      layout.run()
    }
  }, [cyInstance])

  useEffect(() => {
    // Create new instance of Cytoscape when element is available
    if (cyInstance === null && cyEl !== null && cyEl.current !== null) {
      const newCyInstance = createCytoscape(options, cyEl.current)
      
      // Expose Cyjs instance to other component
      if(setCy !== undefined) {
        setCy(newCyInstance)
      }
      initializeCy(newCyInstance, eventHandlers, selectedNodes, selectedEdges)
      // setCy(cyjs)
      setCyInstance(newCyInstance)
      console.log('############### Cytoscape.js instance created ###############', cyEl, newCyInstance)
    }
  }, [cyEl])

  useEffect(() => {
    let selectionStr = selectedNodes.join(', #')

    if (selectionStr.length === 0) {
      return
    }

    selectionStr = '#' + selectionStr

    if (cyInstance !== null) {
      const selectedElements = cyInstance.$(selectionStr)
      console.log('------- Selected ELM ------------', selectedElements)
      cyInstance.nodes().addClass('faded')
      selectedElements.select().addClass('highlight')
    }
  }, [selectedNodes])

  return <div id={id} style={ROOT_STYLE} ref={cyEl} />
}

const initializeCy = (cy, eventHandlers, selectedNodes, selectedEdges) => {
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
        // Clear last one first

        eventHandlers.setSelectedNodes([data.id])
      } else {
        console.log('* tap on Edge', evtTarget.data())
        eventHandlers.setSelectedEdges([data.id.slice(1)])
      }
    }
  })

  cy.on('boxend', (event) => {
    const evtTarget = event.target

    const data = evtTarget.data()
    setTimeout(() => {
      const selectedNodes = cy.$('node:selected')
      const selectedEdges = cy.$('edge:selected')
      const nodeIds = selectedNodes.map((node) => node.data().id)
      const edgeIds = selectedEdges.map((edge) => edge.data().id.slice(1))
      eventHandlers.setSelectedNodes(nodeIds)
      eventHandlers.setSelectedEdges(edgeIds)
    }, 100)
  })

  // cy.on('resize', (event) => {
  //   console.log('--------------resize------------', props, cy.elements().size())
  //   if (cy.elements().size() === 0) {
  //     const net = props.network
  //     if (net !== undefined) {
  //       console.log('------- !!!!!!!!!!!!!lements3 ------------', net)
  //       cy.add(net.elements)
  //       var layout = cy.layout({
  //         name: 'cose',
  //       })

  //       layout.run()
  //     }

  //     // const newVS = addExtraStyle(props.visualStyle)
  //     // cy.style().fromJson(newVS).update()
  //   }
  //   cy.fit()
  // })
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
    console.log(network.data.uuid + '!!!!!!!!!!!!!lements22 ------------', elements)
    cy.add(elements)

    const newVS = addExtraStyle(cyjs.visualStyle)
    cy.style().fromJson(newVS).update()
    cy.fit()
  } else {
    console.log('CANNOT ADD********************************************UP', cyjs)
  }
}

export default CytoscapeRenderer
