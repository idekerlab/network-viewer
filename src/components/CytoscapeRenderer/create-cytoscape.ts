import Cytoscape from 'cytoscape'

const DEFS = {
  padding: 20,
  minZoom: 1.2,
  maxZoom: 2.75,
}

const createCytoscape = (options: object, container: Element, elements: any[] = []): object => {
  const baseParams = {
    container: container,
    elements: elements,
    layout: {
      name: 'preset',
      fit: true,
    },
    locked: true
  }

  let finalParameter = baseParams
  if (options !== undefined) {
    finalParameter = Object.assign({}, baseParams, options)
  }

  console.log('FINAL params===', finalParameter)
  return new Cytoscape(finalParameter)
}

export { createCytoscape }
