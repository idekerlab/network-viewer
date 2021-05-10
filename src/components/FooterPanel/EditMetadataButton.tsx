import React, { FC, ReactElement, useContext } from 'react'
import { useParams } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import AppContext from '../../context/AppState'
import useNetworkPermissions from '../../hooks/useNetworkPermissions'
import { Tooltip } from '@material-ui/core'

import { getCurrentServer } from '../../utils/locationUtil'

const EditMetadataButton: FC = (): ReactElement => {
  const { summary, ndexCredential, config } = useContext(AppContext)
  const { uuid } = useParams()
  const { isLogin } = ndexCredential

  const permissions = useNetworkPermissions(
    uuid,
    config.ndexHttps,
    'v2',
    ndexCredential,
  )

  if (
    isLogin &&
    summary !== undefined &&
    permissions !== undefined &&
    permissions !== null &&
    permissions.data === 'ADMIN'
  ) {
    return (
      <Tooltip title="Edit network properties">
        <IconButton
          color="inherit"
          href={
            getCurrentServer() +
            '/#/properties/network/' +
            summary.externalId +
            '/null?returnto=nnv'
          }
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
    )
  }
  return null
}

export default EditMetadataButton
