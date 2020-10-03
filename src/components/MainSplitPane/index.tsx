import React, { useState, useContext, useEffect, useRef, useLayoutEffect } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import NetworkPanel from '../NetworkPanel'
import DataPanel from '../DataPanel'
import SplitPane from 'react-split-pane'
import { useParams } from 'react-router-dom'
import useNetworkSummary from '../../hooks/useNetworkSummary'
import useCx from '../../hooks/useCx'
import { Typography } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import AppContext from '../../context/AppState'
import ClosedPanel from '../DataPanel/ClosedPanel'
import UIState from '../../model/UIState'
import { UIStateActions } from '../../reducer/uiStateReducer'

const V2 = 'v2'
const V3 = 'v3'

const RENDERER = {
  lgr: 'lgr',
  cyjs: 'cyjs',
}

const def: string[] = []

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainSplitRoot: {
      flexGrow: 1,
      boxSizing: 'border-box',
      zIndex: 99,
      display: 'flex',
      height: '100%',
      flexDirection: 'column',
    },
    leftPanel: {
      display: 'flex',

      flexDirection: 'column',
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
  const containerRef = useRef()

  const { uuid } = useParams()
  const { uiState, ndexCredential, config, uiStateDispatch } = useContext(AppContext)
  const width = window.innerWidth
  const defSize = Math.floor(width * 0.65)

  const [leftWidth, setLeftWidth] = useState(defSize)
  const maxObj = config.maxNumObjects
  const th = config.viewerThreshold

  const [containerHeight, setContainerHeight] = useState(0)

  const assignNewHeight = () => {
    const curRef = containerRef?.current ?? { offsetHeight: 0 }
    if (curRef) {
      setTimeout(() => {
        if (curRef.offsetHeight !== containerHeight) {
          setContainerHeight(curRef.offsetHeight)
        }
      }, 100)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', assignNewHeight)
  }, [])

  useLayoutEffect(() => {
    assignNewHeight()
  })

  useEffect(() => {
    if (!uiState.dataPanelOpen) {
      setLeftWidth(width)
    } else {
      setLeftWidth(defSize)
    }
  }, [uiState.dataPanelOpen])

  const setLeftPanelWidth = (state: UIState) =>
    uiStateDispatch({ type: UIStateActions.SET_LEFT_PANEL_WIDTH, uiState: state })

  useEffect(() => {
    setLeftPanelWidth({ ...uiState, leftPanelWidth: leftWidth })
  }, [leftWidth])

  const result = useNetworkSummary(uuid, config.ndexHttps, V2, ndexCredential)
  const summary = result.data

  let apiVersion = V2
  let cxVersion = null
  let rend = null

  let objectCount = 0
  let edgeCount = 0
  let nodeCount = 0

  if (summary !== undefined && Object.keys(summary).length !== 0) {
    edgeCount = summary['edgeCount']
    nodeCount = summary['nodeCount']

    objectCount = nodeCount + edgeCount

    if (objectCount > th) {
      cxVersion = 2
      rend = RENDERER.lgr
    } else {
      cxVersion = 1
      rend = RENDERER.cyjs
    }
  }

  const cxResponse = useCx(uuid, config.ndexHttps, apiVersion, ndexCredential, maxObj, objectCount, cxVersion)

  if (cxResponse.data === undefined || cxResponse.data == [] || cxResponse.isFetching || rend === null) {
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

  const splitPaneStyle = {
    height: containerHeight,
  }

  return (
    <div ref={containerRef} className={classes.mainSplitRoot}>
      <SplitPane split="vertical" minSize={550} size={leftWidth} onDragFinished={handleChange} style={splitPaneStyle}>
        <NetworkPanel cx={cxResponse.data} renderer={rend} objectCount={objectCount} />
        <DataPanel uuid={uuid} cx={cxResponse.data} />
      </SplitPane>
      {uiState.dataPanelOpen ? <div /> : <ClosedPanel />}
    </div>
  )
}

export default MainSplitPane
