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
    },
    dataPanel: {
      boxSizing: 'border-box',
      width: '100%',
      backgroundColor: '#FEFEFE',
      borderLeft: '1px solid #999999',
    },
  }),
)
const DataPanel = ({ uuid, cx, height }) => {
  const attr: object = useAttributes(uuid, cx)
  const classes = useStyles()

  const defSize = Math.floor(height * 0.7)

  return (
    <SplitPane className={classes.dataPanel} split="horizontal" minSize={150} defaultSize={defSize}>
      <NetworkPropertyPanel />
      <GraphObjectPropertyPanel attributes={attr} cx={cx} />
    </SplitPane>
  )
}

export default DataPanel
