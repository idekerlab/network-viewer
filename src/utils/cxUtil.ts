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

export { getEntry }
