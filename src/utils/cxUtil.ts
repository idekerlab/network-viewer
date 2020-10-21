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

  for (let entry of cx) {
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
  PRESET: 'preset',
}

const getCyjsLayout = (cx: object[], layoutTh: number = 1000): string => {
  const isLayout: boolean = _isLayoutAvailable(cx)

  if (isLayout) {
    return CYJS_LAYOUTS.PRESET
  }

  const numObj = getNodeCount(cx) + getEdgeCount(cx)

  if (numObj < layoutTh) {
    return CYJS_LAYOUTS.COSE
  } else {
    return CYJS_LAYOUTS.CIRCLE
  }
}

const LGR_LAYOUT = {
  PRESET: 'preset',
  RANDOM: 'random',
}
const getLgrLayout = (cx: object[]): string => {
  const nodes = getEntry('nodes', cx)
  if (nodes === undefined || nodes.length === 0) {
    return LGR_LAYOUT.PRESET
  }

  const node = nodes[0]
  if (node === undefined) {
    return LGR_LAYOUT.RANDOM
  }

  if (node.x === undefined || node.y === undefined || (node.x === 0 && node.y === 0)) {
    return LGR_LAYOUT.RANDOM
  }

  return 'preset'
}

const DEF_BG_COLOR = '#FFFFFF'
const getNetworkBackgroundColor = (cx: object[]): string => {
  if (cx === undefined || cx === null || !Array.isArray(cx)) {
    return DEF_BG_COLOR
  }

  const vp = getEntry('cyVisualProperties', cx)
  const cxVersion = getEntry('CXVersion', cx)
  if (vp === undefined || vp.length === 0 || Object.keys(vp).length === 0) {
    if (cxVersion === '2.0') {
      return _extractBackgroundColorCx2(cx)
    }
    return DEF_BG_COLOR
  }

  let bgColor = DEF_BG_COLOR
  let idx = vp.length
  while (idx--) {
    const entry = vp[idx]
    const target = entry['properties_of']
    if (target !== 'network') {
      continue
    }

    const visualPoperties = entry['properties']
    const bgPaint = visualPoperties['NETWORK_BACKGROUND_PAINT']
    if (bgPaint !== undefined) {
      return bgPaint
    }
  }

  return bgColor
}

const _extractBackgroundColorCx2 = (cx) => {
  const vp = getEntry('visualProperties', cx)
  if (vp === undefined || vp.length === 0 || Object.keys(vp).length === 0) {
    return DEF_BG_COLOR
  }

  let bgColor = DEF_BG_COLOR
  let idx = vp.length
  while (idx--) {
    const entry = vp[idx]
    const target = entry['default']
    if (target !== undefined) {
      const networkDefaults = target['network']
      const bgPaint = networkDefaults['NETWORK_BACKGROUND_COLOR']
      if (bgPaint !== undefined) {
        return bgPaint
      }
    }
  }

  return bgColor
}

export { getEntry, getNodeCount, getEdgeCount, getCyjsLayout, getLgrLayout, CYJS_LAYOUTS, getNetworkBackgroundColor }
