import React from 'react'

const rootStyle = {
  width: '5vw',
  height: '100vh',
  padding: 0,
  background: 'rgba(0,0,0,0)',
  zIndex: 999,
  display: 'grid',
  placeItems: 'center',
}

const FloatingToolBar = (props) => {
return <div style={rootStyle}>{props.children}</div>
}

export default FloatingToolBar
