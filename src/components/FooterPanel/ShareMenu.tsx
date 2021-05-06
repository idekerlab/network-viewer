import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'

import Menu from '@material-ui/core/Menu'
import IconButton from '@material-ui/core/IconButton'
import ShareIcon from '@material-ui/icons/Share'
import ShareLinkMenuItem from '../ShareLinkMenuItem'
import CreateDOIMenuItem from '../CreateDOIMenuItem'
import { Tooltip } from '@material-ui/core'
import AppContext from '../../context/AppState'

const ShareMenu = () => {
  const { ndexCredential } = useContext(AppContext)
  
  // Disable menu item if not logged in
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
          size="small"
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
        <ShareLinkMenuItem uuid={uuid} disabled={disabled} />
        <CreateDOIMenuItem uuid={uuid} disabled={disabled} />
      </Menu>
    </>
  )
}

export default ShareMenu
