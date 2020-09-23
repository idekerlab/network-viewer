import React, { useState, useContext, useEffect } from 'react'
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

const V2 = 'v2'
const V3 = 'v3'

const RENDERER = {
  lgr: 'lgr',
  cyjs: 'cyjs',
}

const def: string[] = []

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      flexGrow: 1,
    },
    base: {
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
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
  const { uiState, ndexCredential, config, setUIState } = useContext(AppContext)
  const width = window.innerWidth
  const defSize = Math.floor(width * 0.65)

  const [leftWidth, setLeftWidth] = useState(defSize)
  const maxObj = config.maxNumObjects
  const th = config.viewerThreshold

  useEffect(() => {
    if (!uiState.dataPanelOpen) {
      setLeftWidth(width)
    } else {
      setLeftWidth(defSize)
    }
  }, [uiState.dataPanelOpen])

  useEffect(() => {
    setUIState({...uiState, leftPanelWidth: leftWidth})
  }, [leftWidth])

  const result = useNetworkSummary(uuid, config.ndexHttps, V2, ndexCredential)
  const summary = result.data

  let apiVersion = null
  let rend = null

  let objectCount = 0
  let edgeCount = 0
  let nodeCount = 0

  if (summary !== undefined && Object.keys(summary).length !== 0) {
    edgeCount = summary['edgeCount']
    nodeCount = summary['nodeCount']

    objectCount = nodeCount + edgeCount

    if (objectCount > th) {
      apiVersion = V3
      rend = RENDERER.lgr
    } else {
      apiVersion = V2
      rend = RENDERER.cyjs
    }
  }

  const cxResponse = useCx(uuid, config.ndexHttps, apiVersion, ndexCredential, maxObj, objectCount)

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

  const handleChange = (newWidth) => {
    setLeftWidth(newWidth)
  }

  return (
    <div className={classes.wrapper}>
      <SplitPane className={classes.base} split="vertical" minSize={550} size={leftWidth} onDragFinished={handleChange}>
        <div className={classes.leftPanel}>
          <NetworkPanel cx={cxResponse.data} renderer={rend} objectCount={objectCount} />
          <FooterPanel width={leftWidth} />
        </div>
        <DataPanel uuid={uuid} cx={cxResponse.data} />
      </SplitPane>
      {uiState.dataPanelOpen ? <div /> : <ClosedPanel />}
    </div>
  )
}

export default MainSplitPane
