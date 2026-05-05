import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import MoreIcon from '@material-ui/icons/MoreVert'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { useParams } from 'react-router-dom'
import { Tooltip } from '@material-ui/core'
import { getCurrentServer } from '../../utils/locationUtil'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      height: theme.spacing(5),
      padding: 0,
      margin: 0,
      marginRight: theme.spacing(2),
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  }),
)

const AdvancedMenu = () => {
  const classes = useStyles()
  const { uuid } = useParams()
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const baseUrl: string = getCurrentServer()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'advanced-popover' : undefined

  return (
    <>
      <Tooltip title="Advanced menu">
        <IconButton
          className={classes.button}
          aria-describedby={id}
          onClick={handleClick}
          color="inherit"
          disableFocusRipple={true}
          disableTouchRipple={true}
        >
          <MoreIcon />
        </IconButton>
      </Tooltip>
      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>

        <MenuItem
          onClick={() => {
            window.open('/about')
            setAnchorEl(null)
          }}
        >
          About
        </MenuItem>
        <MenuItem
          onClick={() => {
            window.open('/docs')
            setAnchorEl(null)
          }}
        >
          Docs
        </MenuItem>
        <MenuItem
          onClick={() => {
            window.open('/report-bug')
            setAnchorEl(null)
          }}
        >
          Report bug
        </MenuItem>
        <MenuItem
          onClick={() => {
            window.open('/contact')
            setAnchorEl(null)
          }}
        >
          Contact Us
        </MenuItem>
        <MenuItem
          onClick={() => {
            window.open('/faq')
            setAnchorEl(null)
          }}
        >
          FAQ
        </MenuItem>
      </Menu>
    </>
  )
}

export default AdvancedMenu
