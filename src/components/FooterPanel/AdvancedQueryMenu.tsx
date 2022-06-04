import React, {useState} from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import Menu from '@material-ui/core/Menu'
import IconButton from '@material-ui/core/IconButton'
import MoreIcon from '@material-ui/icons/MoreVert'
import SaveQueryTSVMenuItem from './SaveQueryTSVMenuItem'
import { Tooltip } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    typography: {
      //padding: theme.spacing(2),
    },
  }),
)

const AdvancedQueryMenu = () => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    setOpen(true)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setOpen(false)
  }

  const [open, setOpen] = useState<boolean>(Boolean(anchorEl))
  const id = open ? 'advanced-menu' : undefined

  return (
    <>
      <Tooltip title="Search query advanced menu">
        <IconButton aria-describedby={id} onClick={handleClick} color="inherit">
          <MoreIcon />
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
        <SaveQueryTSVMenuItem setOpen={setOpen}/>
      </Menu>
    </>
  )
}

export default AdvancedQueryMenu
