import React, {
  VFC,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useParams } from 'react-router-dom'

import Menu from '@material-ui/core/Menu'
import IconButton from '@material-ui/core/IconButton'
import ShareIcon from '@material-ui/icons/Share'
import ShareLinkMenuItem from '../ShareLinkMenuItem'
import CreateDOIMenuItem from '../CreateDOIMenuItem'
import { Tooltip } from '@material-ui/core'
import AppContext from '../../context/AppState'
import useNetworkPermissions from '../../hooks/useNetworkPermissions'
import { EDITABLE } from './Editable'
import useCurrentUser from '../../hooks/useCurrentUser'

const DISABLED_MENU_TOOLTIP =
  'This feature is only available to signed-in users'

const ShareMenu: VFC = (): ReactElement => {
  const { uuid } = useParams()
  const { summary, config, ndexCredential } = useContext(AppContext)

  const [isEditable, setIsEditable] = useState<boolean>(false)
  const [isOwner, setIsOwner] = useState<boolean>(false)

  const permissions = useNetworkPermissions(
    uuid,
    config.ndexHttps,
    'v2',
    ndexCredential,
  )

  const currentUser = useCurrentUser(config.ndexHttps, 'v2', ndexCredential)

  useEffect(() => {
    if (summary === undefined || summary === null) {
      return
    }
    if (currentUser === undefined || currentUser.data === undefined) {
      return
    }

    const { owner } = summary
    if (owner === undefined) {
      return
    }

    const currentUserName = currentUser.data['userName']
    if (owner === currentUserName) {
      setIsOwner(true)
    }
  }, [summary, currentUser])

  useEffect(() => {
    if (
      permissions !== undefined &&
      permissions !== null &&
      permissions.data === EDITABLE.ADMIN
    ) {
      setIsEditable(true)
    }
  }, [permissions])

  // Disable menu items if not logged-in
  const disabled = ndexCredential.authenticated !== true

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

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
    if (isLogin && !isEditable) {
      return "You don't have permission to request DOI."
    } else if (isLogin && hasPermission && isDoiAvailable) {
      return 'A DOI has already been requested for this network'
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
              : isOwner
              ? 'Share this network internally or externally'
              : 'You are not the owner of this network'
          }
          arrow
          placement={'left-end'}
        >
          <div>
            <ShareLinkMenuItem uuid={uuid} disabled={disabled || !isOwner} />
          </div>
        </Tooltip>

        <Tooltip
          title={
            disabled || isDoiAvailable || !isEditable
              ? getDisabledMessage(
                  ndexCredential.authenticated,
                  isDoiAvailable,
                  isEditable,
                )
              : 'Request a Digital Object Identifier for this network'
          }
          arrow
          placement={'left-end'}
        >
          <div>
            <CreateDOIMenuItem
              uuid={uuid}
              disabled={disabled || isDoiAvailable || !isEditable}
            />
          </div>
        </Tooltip>
      </Menu>
    </>
  )
}

export default ShareMenu
