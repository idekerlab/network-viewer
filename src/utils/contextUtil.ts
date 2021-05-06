import parse from 'html-react-parser'

const getContextFromCx = (cx) => {
  console.log('getContext')
  if (cx == undefined) {
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

const parseContext = (context) => {
  try {
    const oldContext = JSON.parse(context)
    return Object.keys(oldContext).reduce(
      (c, k) => ((c[k.toUpperCase()] = oldContext[k]), c),
      {},
    )
  } catch (error) {
    console.error('Could not parse @context network attribute as JSON: ', error)
    return {}
  }
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

  let returnString = String(item)
  const [prefix, id] = String(item).split(':')
  if (prefix && id) {
    if (prefix.toUpperCase() in context) {
      returnString =
        '<a href=' +
        context[prefix.toUpperCase()] +
        id +
        ' target="_blank" rel="noopener noreferrer">' +
        item +
        '</a>'
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

export {
  getContextFromCx,
  processList,
  processItem,
  processInternalLink,
  processListAsText,
}
