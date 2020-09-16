const OBJ_TYPE = {
  NODES: 'nodes',
  EDGES: 'edges'
}

const getEntry = (tag: string, cx: object[]) => {
  if (tag === undefined || tag === null) {
    return {}
  }

  if (cx === undefined || cx === null) {
    return {}
  }

  let len = cx.length

  while (len--) {
    const entry = cx[len]
    const value = entry[tag]
    if (value !== undefined) {
      return value
    }
  }

  return {}
}

const getNodesWith = (tag: string, value: any, cx: object[]) => {
  
}

const getNodeCount = (cx) => {
  return _getObjectCount('nodes', cx)
}
const getEdgeCount = (cx) => {
  return _getObjectCount('edges', cx)
}

const _getObjectCount = (tag: string, cx: object[]) => {
  const objs = getEntry(tag, cx)
  if(objs === undefined) {
    return 0
  }

  return objs.length

}

export { getEntry, getNodeCount, getEdgeCount }
