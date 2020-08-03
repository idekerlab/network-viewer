import React from 'react'
import EntryTable from './EntryTable'


const SelectedItems = (props) => {
  const { selectedObjects, label, avatarLetter, attributes } = props
  return <EntryTable selectedObjects={selectedObjects} attributes={attributes} />
}

export default SelectedItems
