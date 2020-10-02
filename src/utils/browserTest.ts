const isWebGL2supported = (): boolean => {
  let canvas
  let ctx

  try {
    canvas = document.createElement('canvas')
    ctx = canvas.getContext('webgl2')
  } catch (e) {
    console.warn('WebGL2 is not supported in your browser.', e)
    return false
  }

  console.log(ctx)
  if (ctx !== undefined && typeof WebGL2RenderingContext !== 'undefined') {
    return true
  }

  console.warn('WebGL2 is not supported in your browser. Please turn on the feature or use different web browser.')
  return false
}

export { isWebGL2supported }
