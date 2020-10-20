import React from 'react'
import SelectionList from './SelectionList'

const GraphObjectPropertyPanel = ({attributes, cx}) => {
  const rootStyle = {
    width: '100%',
    height: '100%',
  }

  return (
    <div style={rootStyle}>
      {cx === undefined ? <div /> : <SelectionList attributes={attributes} cx={cx} />}
    </div>
  )
}

export default GraphObjectPropertyPanel
