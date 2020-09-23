import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/Button'
import MoreIcon from '@material-ui/icons/MoreVert'
import SaveTSVMenuItem from './SaveTSVMenuItem'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    typography: {
      padding: theme.spacing(2),
    },
  }),
)

const AdvancedQueryMenu = () => {
  const classes = useStyles()
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
    <div>
      <IconButton aria-describedby={id} onClick={handleClick} color="inherit">
        <MoreIcon />
      </IconButton>
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
       <SaveTSVMenuItem/>
      </Menu>
    </div>
  )
}

export default AdvancedQueryMenu
