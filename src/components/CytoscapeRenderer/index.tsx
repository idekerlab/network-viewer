import React, { useRef, useEffect, useState, useContext } from 'react'
import { createCytoscape } from './create-cytoscape'
import useCyjs from '../../hooks/useCyjs'
import { getAnnotationRenderer } from '../../utils/cx2cyjs'
import AppContext from '../../context/AppState'

type CytoscapeRendererProps = {
  uuid: string
  cx: object[]
  eventHandlers: object
  layoutName?: string
  setCyReference: Function
  setBusy?: Function
  backgroundColor?: string
}

const baseStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0)',
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
  const { uiState, cyReference } = useContext(AppContext)

  const cyjsNetwork = useCyjs(uuid, cx)
  const annotationRenderer = getAnnotationRenderer()

  useEffect(() => {
    if (cyjsNetwork !== undefined && Object.keys(cyjsNetwork).length === 0) {
      return
    }

    updateNetwork(cyjsNetwork, cyInstance, annotationRenderer, backgroundColor)

    if (Object.keys(cyjsNetwork).length !== 0 && cyInstance !== null) {
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

    updateNetwork(cyjsNetwork, cyInstance, annotationRenderer, backgroundColor)

    if (layoutName !== undefined && cyInstance !== null) {
      const layout = cyInstance.layout({
        name: layoutName,
        animate: false
      })
      layout.run()
      setTimeout(() => {
        cyInstance.fit()
      }, 400)
    }
  }, [cyInstance])

  useEffect(() => {
    // Create new instance of Cytoscape when element is available
    if (cyInstance === null && cyEl !== null && cyEl.current !== null) {
      const newCyInstance = createCytoscape(cyEl.current)

      // Expose Cyjs instance to other component
      if (setCyReference !== undefined) {
        setCyReference(newCyInstance)
        setCyInstance(newCyInstance)
      }
      initializeCy(newCyInstance, eventHandlers)
    }
  }, [])

  if (cyInstance !== null && cyReference.main === cyInstance) {
    lockMain(cyInstance, uiState.showSearchResult)
  }
  return <div style={baseStyle} ref={cyEl} />
}

const lockMain = (cy, lock: boolean): void => {
  if (lock) {
    cy.boxSelectionEnabled(false)
    cy.autounselectify(true)
    cy.nodes().lock()
  } else {
    cy.boxSelectionEnabled(true)
    cy.autounselectify(false)
    cy.nodes().unlock()
  }
}

const initializeCy = (cy, eventHandlers) => {
  cy.on('tap, click', (event) => tapHandler(cy, eventHandlers, event))
  cy.on('boxend', (event) => boxSelectHandler(cy, eventHandlers, event))
}

const boxSelectHandler = (cy, eventHandlers, event) => {
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
  if (evtTarget === cy) {
    setTimeout(() => {
      eventHandlers.clearAll()
    }, 10)
  } else {
    const data = evtTarget.data()

    if (evtTarget.isNode()) {
      setTimeout(() => {
        const selectedNodes = cy.$('node:selected')
        const selectedEdges = cy.$('edge:selected')
        const nodeIds = selectedNodes.map((node) => node.data().id)
        const edgeIds = selectedEdges.map((edge) => edge.data().id.slice(1))
        eventHandlers.setSelectedNodesAndEdges(
          nodeIds,
          edgeIds,
          'node',
          [data.id],
          event.renderedPosition,
        )
      }, 5)
    } else {
      setTimeout(() => {
        const selectedNodes = cy.$('node:selected')
        const selectedEdges = cy.$('edge:selected')
        const nodeIds = selectedNodes.map((node) => node.data().id)
        const edgeIds = selectedEdges.map((edge) => edge.data().id.slice(1))
        eventHandlers.setSelectedNodesAndEdges(
          nodeIds,
          edgeIds,
          'edge',
          [data.id.slice(1)],
          event.renderedPosition,
        )
      }, 5)
    }
  }
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

const updateNetwork = (cyjs, cy, annotationRenderer, backgroundColor) => {
  const { network } = cyjs
  if (network !== undefined && network !== null && cy !== null) {
    const elements = cyjs.network.elements
    cy.add(elements)

    const originalVS = cyjs.visualStyle
    const newVS = addExtraStyle(originalVS)
    try {
      const newState = cy.style().fromJson(newVS)
      newState.update()
    } catch (ex) {
      console.warn('The visual style object contains invalid value:', ex)
    }
    annotationRenderer.drawAnnotationsFromNiceCX(cy, cyjs.annotationNiceCX)
    annotationRenderer.drawBackground(cy, backgroundColor)
  }
}

export default CytoscapeRenderer
