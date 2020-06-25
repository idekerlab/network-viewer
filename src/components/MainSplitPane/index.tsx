import React, { useState } from 'react'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import NetworkPanel from '../NetworkPanel'
import DataPanel from '../DataPanel'
import SplitPane, { Pane } from 'react-split-pane'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    base: {
      width: '100%',
      backgroundColor: 'blue',
      border: '2px solid red',
      boxSizing: 'border-box',
      flexGrow: 1
    },
  }),
)
const MainSplitPane = () => {
  const classes = useStyles()

  const width = window.innerWidth;
  const defSize = Math.floor(width * 0.6)


  return (
    <SplitPane className={classes.base} split="vertical" minSize={150} defaultSize={defSize}>
      <NetworkPanel />
      <DataPanel />
    </SplitPane>
  )
}

export default MainSplitPane
