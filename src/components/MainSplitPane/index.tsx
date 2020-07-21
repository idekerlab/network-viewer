import React, { useState, useContext } from 'react'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import NetworkPanel from '../NetworkPanel'
import DataPanel from '../DataPanel'
import SplitPane, { Pane } from 'react-split-pane'

import useNetwork from '../../hooks/useNetwork'
import AppContext from '../../context/AppState'
import FooterPanel from '../FooterPanel'
import useNetworkSummary from '../../hooks/useNetworkSummary'

const BASE_URL = 'http://dev.ndexbio.org/'
const V2 = 'v2'
const V3 = 'v3'

const RENDERER = {
  lgr: 'lgr',
  cyjs: 'cyjs'
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    base: {
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      flexGrow: 1,
    },
    leftPanel: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
  }),
)
const MainSplitPane = () => {
  const appContext = useContext(AppContext)
  const { uuid } = appContext
  const classes = useStyles()
  const width = window.innerWidth
  const defSize = Math.floor(width * 0.65)
  const result = useNetworkSummary(uuid, BASE_URL, V2)

  const summary = result.data

  let apiVersion = null

  let rend = null

  if (summary !== undefined && Object.keys(summary).length !== 0) {
    const count = summary['edgeCount'] + summary['nodeCount']
    console.log('OBJ count========================================', count)
    if (count > 3000) {
      apiVersion = V3
      rend = RENDERER.lgr
    } else {
      apiVersion = V2
      rend = RENDERER.cyjs
    }
  }
  console.log('**Summary before CALL:', result, summary, apiVersion)

  const { status, data, error, isFetching } = useNetwork(uuid, BASE_URL, apiVersion)

  let networkObj = data
  if (networkObj === undefined) {
    networkObj = {}
  }

  return (
    <SplitPane className={classes.base} split="vertical" minSize={150} defaultSize={defSize}>
      <div className={classes.leftPanel}>
        <NetworkPanel {...networkObj} renderer={rend}/>
        <FooterPanel />
      </div>
      <DataPanel />
    </SplitPane>
  )
}

export default MainSplitPane
