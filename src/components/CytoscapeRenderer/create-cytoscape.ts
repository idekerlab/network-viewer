import Cytoscape from 'cytoscape'

const DEFS = {
  padding: 20,
  minZoom: 1.2,
  maxZoom: 2.75,
}

const createCytoscape = (container: Element, elements: any[] = []): object =>
  new Cytoscape({
    container: container,
    elements: elements,
    layout: {
      name: 'preset',
      fit: true,
    },
  })

export { createCytoscape }
