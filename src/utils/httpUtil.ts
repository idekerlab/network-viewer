const _getCurrentPrefix  = () =>  {
  if (window.location.href.startsWith('https')) {
      return 'https://'
  } else {
    return 'http://'
  }
}

const appendWindowProtocol = (url :string): string => {
  return _getCurrentPrefix() + url;
}

export { appendWindowProtocol }
