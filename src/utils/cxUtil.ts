const OBJ_TYPE = {
  NODES: 'nodes',
  EDGES: 'edges',
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

const getNodeCount = (cx): number => {
  return _getObjectCount('nodes', cx)
}
const getEdgeCount = (cx): number => {
  return _getObjectCount('edges', cx)
}

const _getObjectCount = (tag: string, cx: object[]) => {
  const objs = getEntry(tag, cx)
  if (objs === undefined) {
    return 0
  }

  if (Array.isArray(objs)) {
    return objs.length
  }

  return 0
}

const _isLayoutAvailable = (cx: object[]): boolean => {
  const layoutTag = 'cartesianLayout'
  const layout = getEntry(layoutTag, cx)
  if (layout === undefined || layout.length === 0 || Object.keys(layout).length === 0) {
    return false
  }

  return true
}

/**
 *
 * Apply layout if there is no layout information
 *
 */
const CYJS_LAYOUTS = {
  COSE: 'cose',
  CIRCLE: 'circle',
  GRID: 'grid',
  PRESET: 'preset'
}

const getCyjsLayout = (cx: object[], layoutTh: number = 1000): string => {
  const isLayout: boolean = _isLayoutAvailable(cx)

  if (isLayout) {
    return CYJS_LAYOUTS.PRESET
  }
  
  const numObj = getNodeCount(cx) + getEdgeCount(cx)

  if(numObj < layoutTh) {
    return CYJS_LAYOUTS.COSE
  } else {
    return CYJS_LAYOUTS.CIRCLE
  }
}

export { getEntry, getNodeCount, getEdgeCount, getCyjsLayout, CYJS_LAYOUTS }
