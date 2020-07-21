import Cytoscape from 'cytoscape'

const DEFS = {
  padding: 20,
  minZoom: 1.2,
  maxZoom: 2.75,
}

const createCytoscape = (container: Element): object =>
  new Cytoscape({
    container: container,
    elements: [],
    layout: {
      name: 'preset',
      fit: true,
    },
  })

export { createCytoscape }
