import React, { useState, useContext } from 'react'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import NetworkPanel from '../NetworkPanel'
import DataPanel from '../DataPanel'
import SplitPane, { Pane } from 'react-split-pane'

import useNetwork from '../../hooks/useNetwork'
import AppContext from '../../context/AppState'
import FooterPanel from '../FooterPanel'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    base: {
      width: '100%',
      boxSizing: 'border-box',
      flexGrow: 1,
    },
    leftPanel: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }
  }),
)
const MainSplitPane = () => {
  const appContext = useContext(AppContext)
  const { uuid } = appContext
  const classes = useStyles()
  const { status, data, error, isFetching } = useNetwork(uuid)

  let networkObj = data
  if (networkObj === undefined) {
    networkObj = {}
  }

  const width = window.innerWidth
  const defSize = Math.floor(width * 0.65)

  return (
    <SplitPane className={classes.base} split="vertical" minSize={150} defaultSize={defSize}>
      <div className={classes.leftPanel}>
        <NetworkPanel {...networkObj} />
        <FooterPanel />
      </div>
      <DataPanel />
    </SplitPane>
  )
}

export default MainSplitPane
