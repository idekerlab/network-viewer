import parse from 'html-react-parser'

const getContextFromCx = (cx) => {
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

const processItem = (item, context, parseItem) => {
  if (context == undefined) {
    return item
  }

  const [prefix, id] = item.split(':')
  if (prefix && id) {
    if (prefix.toUpperCase() in context) {
      if (parseItem) {
        return parse(
          '<a href=' +
            context[prefix.toUpperCase()] +
            id +
            ' target="_blank" rel="noopener noreferrer">' +
            item +
            '</a>',
        )
      } else {
        console.log(
          '<a href=' +
            context[prefix.toUpperCase()] +
            id +
            ' target="_blank" rel="noopener noreferrer">' +
            item +
            '</a>',
        )
        return (
          '<a href=' +
          context[prefix.toUpperCase()] +
          id +
          ' target="_blank" rel="noopener noreferrer">' +
          item +
          '</a>'
        )
      }
    }
  }

  return item
}

export { getContextFromCx, processList, processItem }
