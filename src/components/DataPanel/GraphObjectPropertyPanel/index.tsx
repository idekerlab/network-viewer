import React from 'react'
import SelectionList from './SelectionList'

const GraphObjectPropertyPanel = (props) => {
  const rootStyle = {
    width: '100%',
    height: '100%',
  }

  return (
    <div style={rootStyle}>
      <SelectionList {...props} />
    </div>
  )
}

export default GraphObjectPropertyPanel
