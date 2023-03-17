import React, { VFC, ReactElement, useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import AppContext from '../../context/AppState'
import useNetworkPermissions from '../../hooks/useNetworkPermissions'
import { Tooltip } from '@material-ui/core'
import DeleteDialog from './DeleteDialog'

const DeleteButton: VFC = (): ReactElement => {
  const { summary, ndexCredential, config } = useContext(AppContext)
  const { uuid } = useParams()
  const { accesskey } = ndexCredential
  const isLogin: boolean = accesskey !== undefined

  const [open, setOpen] = useState<boolean>(false)

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

  let message = 'Delete function is only available to signed-in users'

  let disabled = true
  if (hasPermission && login) {
    message = 'Delete this network'
    disabled = false
  } else if (!hasPermission && login) {
    message = "You don't have permission to delete this network"
  }

  const _handleClick = (event: any): void => {
    setOpen(true)
  }

  return (
    <Tooltip title={message} arrow placement={'top-start'}>
      <div>
        <IconButton color="inherit" disabled={disabled} onClick={_handleClick}>
          <DeleteIcon />
        </IconButton>
        <DeleteDialog open={open} setOpen={setOpen} />
      </div>
    </Tooltip>
  )
}

export default DeleteButton
