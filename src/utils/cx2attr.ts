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

    if (key in resultObject) {
      resultObject[key].push(...value)
    } else {
      resultObject[key] = value
    }
  }
  if (isV2) {
    const nodeAttr = getNodeAttrsV2(resultObject)
    return {
      nodeAttr: nodeAttr,
      edgeAttr: getEdgeAttrsV2(nodeAttr, resultObject),
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
      if (key === 'n') {
        current.set('name', attrs[key])
      } else if (key === 'r') {
        current.set('Represents', attrs[key])
      } else {
        current.set(key, attrs[key])
      }
    })
    id2attr[entry.id] = current
  }
  return id2attr
}

const getEdgeAttrsV2 = (nodeAttr, kvMap: object) => {
  console.log(kvMap)
  const edges = kvMap['edges']
  const id2attr = {}

  if (edges === undefined || edges.length === 0) {
    addSourceTargetInteractionV2(nodeAttr, edges, id2attr)
    return id2attr
  }

  let len = edges.length
  while (len--) {
    const e = edges[len]
    const id = e['id']
    const current = new Map()

    const attrs = e['v']
    if (attrs !== undefined && attrs !== null) {
      const keys = Object.keys(attrs)
      keys.forEach((key) => {
        if (key !== 'i') {
          current.set(key, attrs[key])
        }
      })
    }
    id2attr[id] = current
  }

  addSourceTargetInteractionV2(nodeAttr, edges, id2attr)
  return id2attr
}

const getEdgeAttrs = (nodeAttr, kvMap: object) => {
  const edgeAttr = kvMap['edgeAttributes']
  const edges = kvMap['edges']
  const id2attr = {}

  if (edgeAttr === undefined) {
    addSourceTargetInteraction(nodeAttr, edges, id2attr)
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

  addSourceTargetInteraction(nodeAttr, edges, id2attr)
  return id2attr
}

const addSourceTargetInteraction = (nodeAttr, edges, id2attr) => {
  if (edges == undefined) {
    return
  }
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
    const interaction = e['i']
    const s = nodeAttr[source]
    const t = nodeAttr[target]

    if (s !== undefined) {
      id2attr[id].set('source', s.get('name'))
    }
    if (t !== undefined) {
      id2attr[id].set('target', t.get('name'))
    }
    if (interaction !== undefined) {
      id2attr[id].set('interaction', interaction)
    }
  }
}

const addSourceTargetInteractionV2 = (nodeAttr, edges, id2attr) => {
  if (edges == undefined) {
    return
  }
  let len = edges.length
  while (len--) {
    const e = edges[len]
    const id = e['id']
    let current = id2attr[id]
    if (current === undefined) {
      current = new Map()
      id2attr[id] = current
    }
    const source = e['s']
    const s = nodeAttr[source]
    const target = e['t']
    const t = nodeAttr[target]
    const interaction = e['v']

    if (s !== undefined) {
      id2attr[id].set('source', s.get('name'))
    }
    if (t !== undefined) {
      id2attr[id].set('target', t.get('name'))
    }
    if (interaction !== undefined) {
      const i = interaction['i']
      id2attr[id].set('interaction', i)
    }
  }
}

const getNodeAttrs = (kvMap: object) => {
  const nodeAttr = kvMap['nodeAttributes']
  const nodes = kvMap['nodes']

  const id2attr = {}

  if (nodes === undefined) {
    return id2attr
  }

  let len = nodes.length
  while (len--) {
    const n = nodes[len]
    const id = n['@id']
    id2attr[id] = new Map()
    id2attr[id].set('name', n['n'])
    id2attr[id].set('Represents', n['r'])
  }

  if (nodeAttr === undefined) {
    return id2attr
  }

  len = nodeAttr.length
  while (len--) {
    const entry = nodeAttr[len]
    const pointer = entry['po']
    let current = id2attr[pointer]
    current.set(entry['n'], entry['v'])
    id2attr[pointer] = current
  }

  return id2attr
}
