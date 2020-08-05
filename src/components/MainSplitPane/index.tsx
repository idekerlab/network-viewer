import React, { useState, useContext } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import NetworkPanel from '../NetworkPanel'
import DataPanel from '../DataPanel'
import SplitPane from 'react-split-pane'
import { useParams } from 'react-router-dom'
import FooterPanel from '../FooterPanel'
import useNetworkSummary from '../../hooks/useNetworkSummary'
import useCx from '../../hooks/useCx'
import { Typography } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import AppContext from '../../context/AppState'
import ClosedPanel from '../DataPanel/ClosedPanel'

const BASE_URL = 'http://dev.ndexbio.org/'
const V2 = 'v2'
const V3 = 'v3'

const RENDERER = {
  lgr: 'lgr',
  cyjs: 'cyjs',
}

const def: string[] = []

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
    initPanel: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      color: '#AAAAAA',
      display: 'grid',
      placeItems: 'center',
    },
    message: {
      height: '10em',
      display: 'grid',
      placeItems: 'center',
    },
  }),
)
const MainSplitPane = () => {
  const classes = useStyles()
  const { uuid } = useParams()
  const appContext = useContext(AppContext)
  const { dataPanelOpen } = appContext

  // Selected items in the current view
  const [selectedNodes, setSelectedNodes] = useState([])
  const [selectedEdges, setSelectedEdges] = useState([])

  const width = window.innerWidth
  const defSize = Math.floor(width * 0.65)

  const result = useNetworkSummary(uuid, BASE_URL, V2)
  const summary = result.data

  let apiVersion = null
  let rend = null

  if (summary !== undefined && Object.keys(summary).length !== 0) {
    const count = summary['edgeCount'] + summary['nodeCount']
    if (count > 3000) {
      apiVersion = V3
      rend = RENDERER.lgr
    } else {
      apiVersion = V2
      rend = RENDERER.cyjs
    }
  }

  // const { status, data, error, isFetching } = useNetwork(uuid, BASE_URL, apiVersion)
  const cxResponse = useCx(uuid, BASE_URL, apiVersion)

  const getMainPanel = () => {}

  if (cxResponse.data === undefined || cxResponse.isFetching || rend === null) {
    return (
      <div className={classes.initPanel}>
        <div className={classes.message}>
          <Typography variant="h6">Initializing Network Viewer...</Typography>
          <CircularProgress color={'secondary'} disableShrink />
        </div>
      </div>
    )
  }

  const selection = { selectedNodes, selectedEdges, setSelectedNodes, setSelectedEdges }

  if (!dataPanelOpen) {
    return (
      <SplitPane className={classes.base} split="vertical" minSize={150} size={width-40} allowResize={false}>
        <div className={classes.leftPanel}>
          <NetworkPanel summary={summary} cx={cxResponse.data} renderer={rend} {...selection} />
          <FooterPanel />
        </div>
        <ClosedPanel />
      </SplitPane>
    )
  }

  return (
    <SplitPane className={classes.base} split="vertical" minSize={150} size={defSize}>
      <div className={classes.leftPanel}>
        <NetworkPanel summary={summary} cx={cxResponse.data} renderer={rend} {...selection} />
        <FooterPanel />
      </div>
      <DataPanel uuid={uuid} cx={cxResponse.data} selection={selection} />
    </SplitPane>
  )
}

export default MainSplitPane
