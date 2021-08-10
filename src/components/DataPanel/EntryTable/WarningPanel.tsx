import React, { VFC } from 'react'

const WarningPanel: VFC<{ type: string, selectedCount: number }> = ({ type, selectedCount }) => {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'grid',
        justifyContent: 'center',
        alignContent: 'center',
	color: 'red'
      }}
    >
      <h3>
        {`${selectedCount} objects has been selected.  It is too big to render`} 
      </h3>
    </div>
  )
}

export default WarningPanel
