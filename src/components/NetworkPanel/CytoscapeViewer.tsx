import React, {useEffect} from 'react'
import CytoscapeComponent from 'react-cytoscapejs'

// This is the global instance of Cytoscape.js
let cyInstance

// Default network background color
const DEF_BG_COLOR = 'orange'

const NET_AREA_STYLE = {
  width: '100%',
  height: '100%',
  background: '#FFFFFF',
}

const CytoscapeViewer = (props) => {
  const { network, visualStyle } = props

  useEffect(() => {
    console.log('CY init----------------------')
    if(cyInstance === undefined) {
      return
    }

    cyInstance.on('tap', 'node', function() {
      try {
        console.log('from Cy', cyInstance.nodes())
      } catch (e) {
        console.warn(e)
      }
    })
    console.log('CY init OK----------------------', cyInstance)
    return () => {
    }
  }, [])

  if(network === undefined) {
    return <div />
  }

  // Use default color if this property is not available.
  let backgroundColor = network.backgroundColor
  if (backgroundColor === null || backgroundColor === undefined) {
    backgroundColor = DEF_BG_COLOR
  }

  // Network background should be set via CSS.

  return (
    <CytoscapeComponent
      elements={network.elements}
      style={NET_AREA_STYLE}
      stylesheet={visualStyle}
      cy={(cy) => {
        cyInstance = cy
      }}
    />
  )
}
export default CytoscapeViewer
