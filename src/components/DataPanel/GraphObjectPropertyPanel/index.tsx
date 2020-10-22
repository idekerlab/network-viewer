import React from 'react'
import SelectionList from './SelectionList'

const GraphObjectPropertyPanel = ({ cx }) => {
  const rootStyle = {
    width: '100%',
    height: '100%',
  }

  return <div style={rootStyle}>{cx === undefined ? <div /> : <SelectionList cx={cx} />}</div>
}

export default GraphObjectPropertyPanel
