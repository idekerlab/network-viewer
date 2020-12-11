import parse from 'html-react-parser'

const getContextFromCx = (cx) => {
  if (cx == undefined) {
    return {}
  }

  for (let obj of cx) {
    if (obj['networkAttributes']) {
      for (let item of obj['networkAttributes']) {
        if (item['n'] === '@context') {
          const oldContext = JSON.parse(item['v'])
          return Object.keys(oldContext).reduce((c, k) => ((c[k.toUpperCase()] = oldContext[k]), c), {})
        }
      }
    }
  }
  return null
}

const processList = (list, context) => {
  let listString = ''
  for (let item of list) {
    listString += processItem(item, context, false) + ', '
  }
  return parse(listString.slice(0, -2))
}

const processListAsText = (list) => {
  let listString = ''
  for (let item of list) {
    listString += item + ', '
  }
  return listString.slice(0, -2)
}

const processItem = (item, context, parseItem) => {
  if (context == undefined || item == undefined) {
    return item
  }

  let returnString = item
  const [prefix, id] = item.split(':')
  if (prefix && id) {
    if (prefix.toUpperCase() in context) {
      returnString =
        '<a href=' + context[prefix.toUpperCase()] + id + ' target="_blank" rel="noopener noreferrer">' + item + '</a>'
    }
  }

  if (parseItem) {
    return parse(returnString)
  }

  return returnString
}

const processInternalLink = (item, url) => {
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

export { getContextFromCx, processList, processItem, processInternalLink, processListAsText }
