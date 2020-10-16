import React, { FC, useContext } from 'react'
import { useParams } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import AppContext from '../../context/AppState'
import useNetworkPermissions from '../../hooks/useNetworkPermissions'

const EditMetadataButton: FC = () => {
  const { summary, ndexCredential, config } = useContext(AppContext)

  const { uuid } = useParams()

  const permissions = useNetworkPermissions(uuid, config.ndexHttps, 'v2', ndexCredential);

  if (
    ndexCredential.isLogin &&
    summary !== undefined &&
    permissions && permissions.data === 'ADMIN'
  ) {
    return (
      <IconButton href={'https://'+config.ndexUrl+'/#/properties/network/' + summary.externalId + '/null?returnto=nnv'} >
        <EditIcon />
      </IconButton>
    )
  }
  return null
}

export default EditMetadataButton
