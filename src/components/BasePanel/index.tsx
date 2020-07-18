import React, { useState, createContext, useContext } from 'react'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import NdexAppBar from '../NdexAppBar'
import MainSplitPane from '../MainSplitPane'
import { BrowserRouter as Router, Switch, useLocation } from 'react-router-dom'
import AppContext from '../../context/AppState'
import FooterPanel from '../FooterPanel'



const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
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

const BasePanel = () => {
  const classes = useStyles()
  let location = useLocation()
  const appContext = useContext(AppContext)

  const uuid = getUUID(location)
  appContext.setUuid(uuid)

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

const getUUID = (location) => {
  const parts = location.pathname.split('/')
  return parts[parts.length - 1]
}

export default BasePanel
