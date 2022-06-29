const appendWindowProtocol = (url :string): string => {
  return window.location.protocol + '//' + url;
}

const getCurrentServer = (): string => {
  // console.log('host: '+ window.location.host);
  return `${window.location.protocol}//${window.location.host}`; 
}

export { appendWindowProtocol, getCurrentServer }