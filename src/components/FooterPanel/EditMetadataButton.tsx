import React, { FC, ReactElement, useContext } from 'react'
import { useParams } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import LockIcon from '@material-ui/icons/Lock'
import AppContext from '../../context/AppState'
import useNetworkPermissions from '../../hooks/useNetworkPermissions'
import { Tooltip } from '@material-ui/core'

import { getCurrentServer } from '../../utils/locationUtil'
import useNetworkSummary from '../../hooks/useNetworkSummary'

const EditMetadataButton: FC = (): ReactElement => {
  const { summary, ndexCredential, config } = useContext(AppContext)
  const { uuid } = useParams()
  const { isLogin } = ndexCredential

  const summaryResponse = useNetworkSummary(
    uuid,
    config.ndexHttps,
    'v2',
    ndexCredential,
  )
  const networkSummary = summaryResponse.data
  let isDoiAvailable = false
  let readOnly = false

  if (networkSummary !== undefined && networkSummary !== null) {
    const { doi } = summary
    if (doi !== undefined) {
      // DOI status available.
      isDoiAvailable = true
    }

    readOnly = networkSummary.isReadOnly
  }

  const permissions = useNetworkPermissions(
    uuid,
    config.ndexHttps,
    'v2',
    ndexCredential,
  )

  let hasPermission = false
  if (
    permissions !== undefined &&
    permissions !== null &&
    permissions.data === 'ADMIN'
  ) {
    hasPermission = true
  }

  let login: boolean = false
  if (isLogin && summary !== undefined) {
    login = true
  }

  let message = 'This feature is only available to signed-in users'

  let disabled = true
  if (hasPermission && login) {
    if (isDoiAvailable) {
      message =
        'Network properties cannot be modified once a DOI has been requested or assigned'
    } else {
      if (readOnly) {
        message = 'This network is read-only'
        disabled = true
      } else {
        message = 'Edit network properties'
        disabled = false
      }
    }
  } else if (!hasPermission && login) {
    message = "You don't have permission to edit this network"
  }

  return (
    <Tooltip title={message} arrow placement={'top-start'}>
      <div>
        <IconButton
          disabled={disabled}
          color="inherit"
          href={
            getCurrentServer() +
            '/#/properties/network/' +
            summary.externalId +
            '/null?returnto=nnv'
          }
        >
          {readOnly || disabled ? <LockIcon /> : <EditIcon />}
        </IconButton>
      </div>
    </Tooltip>
  )
}

export default EditMetadataButton
