import React from 'react'
import SelectionList from './SelectionList'

const GraphObjectPropertyPanel = (props) => {
  const { height } = props
  const rootStyle = {
    width: '100%',
    height,
    padding: 0,
  }

  return (
    <div style={rootStyle}>
      <SelectionList {...props} />
    </div>
  )
}

export default GraphObjectPropertyPanel
