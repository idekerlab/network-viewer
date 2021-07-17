import React, { VFC } from 'react'

const EmptyPanel: VFC<{ type: string }> = ({ type }) => {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'grid',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      <h3>
        Select {type === 'edge' ? 'an edge' : 'a node'} to view it in the table.
      </h3>
    </div>
  )
}

export default EmptyPanel
