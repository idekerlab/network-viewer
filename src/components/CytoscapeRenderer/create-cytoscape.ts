import Cytoscape from 'cytoscape'
import CyCanvas from 'cytoscape-canvas'
Cytoscape.use(CyCanvas)

const createCytoscape = (container: Element, elements: any[] = []): object => {
  const baseParams = {
    container: container,
    elements: elements,
    layout: {
      name: 'preset',
      fit: true,
    },
    locked: true,
  }

  return new Cytoscape(baseParams)
}

export { createCytoscape }
