import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/Button'
import MoreIcon from '@material-ui/icons/MoreVert'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    typography: {
      padding: theme.spacing(2),
    },
    button: {
      margin: theme.spacing(1),
    },
  }),
)

const AdvancedMenu = () => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'advanced-popover' : undefined

  return (
    <div>
      <IconButton size="small" className={classes.button} aria-describedby={id} onClick={handleClick} color="inherit">
        <MoreIcon />
      </IconButton>
      {/*
      <Popover
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
        <Typography className={classes.typography}>(Advanced menu items)</Typography>
        <Typography>hi</Typography>
        <Typography>ho</Typography>
      </Popover>*/}
      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            window.open('https://home.ndexbio.org/about-ndex/')
            setAnchorEl(null)
          }}
        >
          About
        </MenuItem>
        <MenuItem
          onClick={() => {
            window.open('https://home.ndexbio.org/quick-start/')
            setAnchorEl(null)
          }}
        >
          Docs
        </MenuItem>
        <MenuItem
          onClick={() => {
            window.open('https://home.ndexbio.org/report-a-bug/')
            setAnchorEl(null)
          }}
        >
          Report bug
        </MenuItem>
        <MenuItem
          onClick={() => {
            window.open('https://home.ndexbio.org/contact-us/')
            setAnchorEl(null)
          }}
        >
          Contact Us
        </MenuItem>
        <MenuItem
          onClick={() => {
            window.open('https://home.ndexbio.org/faq/')
            setAnchorEl(null)
          }}
        >
          FAQ
        </MenuItem>
      </Menu>
    </div>
  )
}

export default AdvancedMenu
