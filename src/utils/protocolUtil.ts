const appendWindowProtocol = (url :string): string => {
  return window.location.protocol + '//' + url;
}

export { appendWindowProtocol }
