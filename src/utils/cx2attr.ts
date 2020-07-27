
export const getAttributeMap = (cx: object[]) => {
  const resultObject = {}

  let len = cx.length
  while (len--) {
    const entry = cx[len]
    const key = Object.keys(entry)[0]
    const value = entry[key]

    resultObject[key] = value
  }

  console.log('CX and kv', cx, resultObject)

  return {
    nodeAttr: getNodeAttrs(resultObject),
    edgeAttr: getEdgeAttrs(resultObject)
  }
}

const getEdgeAttrs = (kvMap: object) => {
  const edgeAttr = kvMap['edgeAttributes']
  const edges = kvMap['edges']
  const id2attr = {}

  if(edgeAttr === undefined) {
    return id2attr
  }

  let len = edgeAttr.length
  while (len--) {
    const entry = edgeAttr[len]
    const pointer = entry['po']

    let current = id2attr[pointer]
    if (current === undefined) {
      current = new Map()
    }
    current.set(entry['n'], entry['v'])
    id2attr[pointer] = current
  }

  len = edges.length
  while(len--) {
    const e = edges[len]
    const id = e['@id']
    const source = e['s']
    const target = e['t']
    id2attr[id].set('source', source)
    id2attr[id].set('target', target)
  }

  return id2attr
}

const getNodeAttrs = (kvMap: object) => {
  const nodeAttr = kvMap['nodeAttributes']
  const nodes = kvMap['nodes']

  const id2attr = {}

  if(nodeAttr === undefined) {
    return id2attr
  }

  let len = nodeAttr.length
  while (len--) {
    const entry = nodeAttr[len]
    const pointer = entry['po']

    let current = id2attr[pointer]
    if (current === undefined) {
      current = new Map()
    }
    current.set(entry['n'], entry['v'])
    id2attr[pointer] = current
  }

  len = nodes.length
  while(len--) {
    const n = nodes[len]
    const id = n['@id']
    const val = n['n']
    id2attr[id].set('name', val)
  }

  return id2attr
}