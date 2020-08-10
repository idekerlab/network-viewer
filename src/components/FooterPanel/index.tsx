import React, { FC, Fragment } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import SearchBox from './SearchBox'
import AdvancedMenu from './AdvancedMenu'

import cyLogo from '../../assets/images/cy-logo-orange.svg'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      padding: theme.spacing(2, 2, 0),
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
      position: 'fixed',
      bottom: 0,
      left: 0,
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
    <Toolbar className={classes.toolBar}>
      <SearchBox />
      <div className={classes.grow} />
      <IconButton aria-label="Open in Cytoscape Desktop">
        <img alt="Cy3 logo" src={cyLogo} className={classes.cyLogo} />
      </IconButton>
      <AdvancedMenu />
    </Toolbar>
  )
}

export default FooterPanel
