import React, { FC, useContext } from 'react'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import AppContext from '../../context/AppState'

const EditMetadataButton: FC = () => {
  const { summary, ndexCredential } = useContext(AppContext)

  if (
    ndexCredential.isLogin &&
    !ndexCredential.isGoogle &&
    summary !== undefined &&
    ndexCredential.basic.userId === summary.owner
  ) {
    return (
      <IconButton href={'https://dev.ndexbio.org/#/properties/network/' + summary.externalId + '/null?returnto=nnv'} >
        <EditIcon />
      </IconButton>
    )
  }
  return null
}

export default EditMetadataButton
