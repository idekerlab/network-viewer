const CX2_TAG = 'CXVersion'

const isCxV2 = (cx: object[]) => {
  let len = cx.length
  while (len--) {
    const entry = cx[len]
    const version = entry[CX2_TAG]
    if (version !== undefined && version === '2.0') {
      return true
    }
  }

  return false
}

export const getAttributeMap = (cx: object[]) => {
  const isV2 = isCxV2(cx)
  const resultObject = {}

  let len = cx.length
  while (len--) {
    const entry = cx[len]
    const key = Object.keys(entry)[0]
    const value = entry[key]

    resultObject[key] = value
  }

  console.log('CX and kv', cx, resultObject)

  if (isV2) {
    return {
      nodeAttr: getNodeAttrsV2(resultObject),
      edgeAttr: getEdgeAttrsV2(resultObject),
    }
  } else {
    const nodeAttr = getNodeAttrs(resultObject)
    return {
      nodeAttr,
      edgeAttr: getEdgeAttrs(nodeAttr, resultObject),
    }
  }
}

const getNodeAttrsV2 = (kvMap: object) => {
  const nodes = kvMap['nodes']
  const id2attr = {}

  let len = nodes.length
  while (len--) {
    const entry = nodes[len]
    const attrs = entry['v']
    const current = new Map()
    const keys = Object.keys(attrs)
    keys.forEach((key) => {
      current.set(key, attrs[key])
    })
    current.set('name', attrs['n'])
    id2attr[entry.id] = current
  }
  return id2attr
}

const getEdgeAttrsV2 = (kvMap: object) => {
  const edges = kvMap['edges']
  const id2attr = {}

  if (edges === undefined || edges.length === 0) {
    return id2attr
  }

  let len = edges.length
  while (len--) {
    const e = edges[len]
    const id = e['id']
    const current = new Map()
    const source = e['s']
    const target = e['t']
    current.set('source', source)
    current.set('target', target)
    const attrs = e['v']
    if (attrs !== undefined && attrs !== null) {
      const keys = Object.keys(attrs)
      keys.forEach((key) => {
        current.set(key, attrs[key])
      })
    }
    id2attr[id] = current
  }

  return id2attr
}

const getEdgeAttrs = (nodeArrt, kvMap: object) => {
  const edgeAttr = kvMap['edgeAttributes']
  const edges = kvMap['edges']
  const nodes = kvMap['nodes']
  const id2attr = {}

  if (edgeAttr === undefined) {
    addSourceTarget(nodeArrt, edges, id2attr)
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

  addSourceTarget(nodeArrt, edges, id2attr)
  return id2attr
}
const addSourceTarget = (nodeAttr, edges, id2attr) => {
  let len = edges.length
  while (len--) {
    const e = edges[len]
    const id = e['@id']
    let current = id2attr[id]
    if (current === undefined) {
      current = new Map()
      id2attr[id] = current
    }
    const source = e['s']
    const target = e['t']
    const s = nodeAttr[source]
    const t = nodeAttr[target]
    // console.log(s,t)
    id2attr[id].set('source', s.get('name'))
    id2attr[id].set('target', t.get('name'))
  }
}

const getNodeAttrs = (kvMap: object) => {
  const nodeAttr = kvMap['nodeAttributes']
  const nodes = kvMap['nodes']

  const id2attr = {}

  if (nodeAttr === undefined) {
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
  while (len--) {
    const n = nodes[len]
    const id = n['@id']
    const val = n['n']
    id2attr[id].set('name', val)
  }

  return id2attr
}
