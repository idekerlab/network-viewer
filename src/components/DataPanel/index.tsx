import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import SplitPane from 'react-split-pane'
import useAttributes from '../../hooks/useAttributes'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import GraphObjectPropertyPanel from './GraphObjectPropertyPanel'
import NetworkPropertyPanel from './NetworkPropertyPanel'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    },
    dataPanel: {
      flexGrow: 1,
      width: '100%',
      height: '100%',
      backgroundColor: '#FEFEFE',
    },
  }),
)
const DataPanel = ({ cx }) => {
  const classes = useStyles()

  const defSize = window.innerHeight * 0.7
  const minSize = window.innerHeight * 0.1

  return (
    <div className={classes.container}>
      <SplitPane className={classes.dataPanel} split="horizontal" minSize={minSize} defaultSize={defSize}>
        <NetworkPropertyPanel />
        <GraphObjectPropertyPanel cx={cx} />
      </SplitPane>
    </div>
  )
}

export default DataPanel
