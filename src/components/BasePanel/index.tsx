import React from 'react'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import NdexAppBar from '../NdexAppBar'
import MainSplitPane from '../MainSplitPane'


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#0000FF',
      display: 'flex',
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
    },
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
  }),
)

/**
 * Base panel for setting up all basic panels
 *  - Toolbar
 */
const BasePanel = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CssBaseline />

      <NdexAppBar />

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <MainSplitPane />
      </main>
    </div>
  )
}

export default BasePanel
