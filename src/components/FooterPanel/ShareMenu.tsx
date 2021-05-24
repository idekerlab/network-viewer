import React, { FC, ReactElement, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import Menu from '@material-ui/core/Menu'
import IconButton from '@material-ui/core/IconButton'
import ShareIcon from '@material-ui/icons/Share'
import ShareLinkMenuItem from '../ShareLinkMenuItem'
import CreateDOIMenuItem from '../CreateDOIMenuItem'
import { Tooltip } from '@material-ui/core'
import AppContext from '../../context/AppState'
import useNetworkSummary from '../../hooks/useNetworkSummary'
import useNetworkPermissions from '../../hooks/useNetworkPermissions'

const DISABLED_MENU_TOOLTIP =
  'This feature is only available to signed-in users'
const DISABLED_NOT_ADMIN = 'You need to be the owner of this network'

const ShareMenu: FC = (): ReactElement => {
  const { uuid } = useParams()
  const { config, ndexCredential } = useContext(AppContext)

  const summaryResponse = useNetworkSummary(
    uuid,
    config.ndexHttps,
    'v2',
    ndexCredential,
  )
  const summary = summaryResponse.data

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

  // Disable menu items if not logged-in
  const disabled = !ndexCredential.isLogin

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const getDisabledMessage = (
    isLogin: boolean,
    isDoiAvailable: boolean,
    hasPermission: boolean,
  ): string => {
    if(isLogin && !hasPermission) {
      return "You don't have permission to request DOI."
    } else if(isLogin && hasPermission && isDoiAvailable) {
      return "A DOI has already been requested for this network"
    } else {
      return DISABLED_MENU_TOOLTIP
    }
  }

  const open = Boolean(anchorEl)
  const id = open ? 'advanced-menu' : undefined
  let isDoiAvailable = false
  if (summary !== undefined && summary !== null) {
    const { doi } = summary
    if (doi !== undefined) {
      // DOI status available.  Check its current state
      isDoiAvailable = true
    }
  }

  return (
    <>
      <Tooltip title="Share...">
        <IconButton
          aria-label="share"
          aria-describedby={id}
          onClick={handleClick}
          color="inherit"
        >
          <ShareIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Tooltip
          title={
            disabled
              ? DISABLED_MENU_TOOLTIP
              : 'Share this network internally or externally'
          }
          arrow
          placement={'left-end'}
        >
          <div>
            <ShareLinkMenuItem uuid={uuid} disabled={disabled} />
          </div>
        </Tooltip>

        <Tooltip
          title={
            disabled || isDoiAvailable || !hasPermission
              ? getDisabledMessage(ndexCredential.isLogin, isDoiAvailable, hasPermission)
              : 'Request a Digital Object Identifier for this network'
          }
          arrow
          placement={'left-end'}
        >
          <div>
            <CreateDOIMenuItem
              uuid={uuid}
              disabled={disabled || isDoiAvailable || !hasPermission}
            />
          </div>
        </Tooltip>
      </Menu>
    </>
  )
}

export default ShareMenu
