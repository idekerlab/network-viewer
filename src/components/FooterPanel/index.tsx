import React, { FC, Fragment } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import Fab from '@material-ui/core/Fab'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Avatar from '@material-ui/core/Avatar'
import MenuIcon from '@material-ui/icons/Menu'
import AddIcon from '@material-ui/icons/Add'
import SearchIcon from '@material-ui/icons/Search'
import SearchBox from './SearchBox'
import AdvancedMenu from './AdvancedMenu'

import cyLogo from '../../assets/images/cy-logo-orange.svg'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      padding: theme.spacing(2, 2, 0),
    },
    paper: {
      paddingBottom: 50,
    },
    list: {
      marginBottom: theme.spacing(2),
    },
    subheader: {
      backgroundColor: theme.palette.background.paper,
    },
    appBar: {
      top: 'auto',
      bottom: 0,
    },
    toolBar: {
      marginLeft: 0,
      paddingLeft: 0,
    },
    grow: {
      flexGrow: 1,
    },
    fabButton: {
      position: 'absolute',
      zIndex: 1,
      top: -30,
      left: 0,
      right: 0,
      margin: '0 auto',
    },

    cyLogo: {
      width: '1.2em',
    },
  }),
)

const FooterPanel: FC = () => {
  const classes = useStyles()

  return (
    <AppBar position="fixed" color="primary" className={classes.appBar}>
      <Toolbar className={classes.toolBar}>
        <SearchBox />
        <div className={classes.grow} />
        <IconButton aria-label="Open in Cytoscape Desktop">
          <img alt="Cy3 logo" src={cyLogo} className={classes.cyLogo} />
        </IconButton>
        <AdvancedMenu />
      </Toolbar>
    </AppBar>
  )
}

export default FooterPanel
