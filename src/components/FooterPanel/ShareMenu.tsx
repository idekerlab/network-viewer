import React, { FC, ReactElement, useContext } from 'react'
import { useParams } from 'react-router-dom'

import Menu from '@material-ui/core/Menu'
import IconButton from '@material-ui/core/IconButton'
import ShareIcon from '@material-ui/icons/Share'
import ShareLinkMenuItem from '../ShareLinkMenuItem'
import CreateDOIMenuItem from '../CreateDOIMenuItem'
import { Tooltip } from '@material-ui/core'
import AppContext from '../../context/AppState'

const DISABLED_MENU_TOOLTIP =
  'This feature is only available to signed-in users'

const ShareMenu: FC = (): ReactElement => {
  const { ndexCredential } = useContext(AppContext)

  // Disable menu items if not logged-in
  const disabled = !ndexCredential.isLogin

  const { uuid } = useParams()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'advanced-menu' : undefined

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
            disabled
              ? DISABLED_MENU_TOOLTIP
              : 'Request a Digital Object Identifier for this network'
          }
          arrow
          placement={'left-end'}
        >
          <div>
            <CreateDOIMenuItem uuid={uuid} disabled={disabled} />
          </div>
        </Tooltip>
      </Menu>
    </>
  )
}

export default ShareMenu
