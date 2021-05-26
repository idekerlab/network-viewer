import parse from 'html-react-parser'

const getContextFromCx = (cx: any[]) => {
  if (cx === undefined) {
    return {}
  }
  //Check version
  let version2 = false
  for (let obj of cx) {
    if (obj['CXVersion'] === '2.0') {
      version2 = true
      break
    }
  }
  for (let obj of cx) {
    if (obj['networkAttributes']) {
      for (let item of obj['networkAttributes']) {
        if (version2) {
          if (item['@context']) {
            return parseContext(item['@context'])
          }
        } else {
          if (item['n'] === '@context') {
            return parseContext(item['v'])
          }
        }
      }
    }
  }
  return null
}

const parseContext = (context: string) => {
  try {
    const oldContext = JSON.parse(context)
    return Object.keys(oldContext).reduce(
      (c, k) => ((c[k.toUpperCase()] = oldContext[k]), c),
      {},
    )
  } catch (error) {
    console.warn('Could not parse @context network attribute as JSON: ', error)
    return {}
  }
}

const processList = (list: string[], context) => {
  let listString = ''
  for (let item of list) {
    listString += processItem(item, context, false) + ', '
  }
  return parse(listString.slice(0, -2))
}

const processListAsText = (list: string[]) => {
  let listString = ''
  for (let item of list) {
    listString += item + ', '
  }
  return listString.slice(0, -2)
}

const processItem = (item: string, context: object, parseItem: boolean) => {
  if (item === undefined || item === null) {
    return item
  }

  let itemString = item.toString()

  if (context === undefined || context === null) {
    if (parseItem) {
      return parse(itemString)
    }
    return itemString
  }

  const [prefix, id] = String(item).split(':')
  if (prefix && id) {
    if (prefix.toUpperCase() in context) {
      itemString =
        '<a href=' +
        context[prefix.toUpperCase()] +
        id +
        ' target="_blank" rel="noopener noreferrer">' +
        item +
        '</a>'
    }
  }

  if (parseItem) {
    return parse(itemString)
  }

  return itemString
}

const processInternalLink = (item: string, url: string) => {
  return parse(
    '<a href=https://' +
      url +
      '/viewer/networks/' +
      item +
      ' target="_blank" rel="noopener noreferrer">' +
      item +
      '</a>',
  )
}

export {
  getContextFromCx,
  processList,
  processItem,
  processInternalLink,
  processListAsText,
}
