import React, { useState, useContext, useEffect, useRef, useLayoutEffect } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import NetworkPanel from '../NetworkPanel'
import DataPanel from '../DataPanel'
import SplitPane from 'react-split-pane'
import { useParams } from 'react-router-dom'
import useNetworkSummary from '../../hooks/useNetworkSummary'
import useCx from '../../hooks/useCx'
import AppContext from '../../context/AppState'
import ClosedPanel from '../DataPanel/ClosedPanel'
import UIState from '../../model/UIState'
import { UIStateActions } from '../../reducer/uiStateReducer'
import { isWebGL2supported } from '../../utils/browserTest'
import Title from '../Title'
import {Redirect} from 'react-router'


import InitializationPanel from './InitializationPanel'

const V2 = 'v2'

const RENDERER = {
  lgr: 'lgr',
  cyjs: 'cyjs',
}

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
  }),
)

const getDefaultPanelWidth = (): number => {
  return Math.floor(window.innerWidth * 0.65)
}

type FetchParams = {
  cxVersion: string
  count: number
  renderer: string
  name: string
}

const DFE_FETCH_PARAMS: FetchParams = {
  cxVersion: '1',
  count: Number.POSITIVE_INFINITY,
  renderer: RENDERER.cyjs,
  name: 'N/A',
}

const getFetchParams = (summary: object, th: number): FetchParams => {
  if (summary === undefined) {
    return DFE_FETCH_PARAMS
  }
  const count = summary['edgeCount'] + summary['nodeCount']
  let cxVersion = '1'
  let renderer = RENDERER.cyjs

  if (count > th) {
    cxVersion = '2'
    renderer = RENDERER.lgr
  }

  const fetchParams: FetchParams = {
    cxVersion,
    count,
    renderer,
    name: summary['name'],
  }
  return fetchParams
}

const MainSplitPane = () => {
  const classes = useStyles()
  const containerRef = useRef()
  const { uuid } = useParams()
  const { uiState, ndexCredential, config, uiStateDispatch } = useContext(AppContext)
  const maxObj = config.maxNumObjects
  const th = config.viewerThreshold

  const summaryResponse = useNetworkSummary(uuid, config.ndexHttps, V2, ndexCredential)
  const summary = summaryResponse.data
  const fetchParams = getFetchParams(summary, th)

  const cxResponse = useCx(uuid, config.ndexHttps, V2, ndexCredential, maxObj, fetchParams.count, fetchParams.cxVersion)
  const cx = cxResponse.data

  // Local states
  const [leftWidth, setLeftWidth] = useState(getDefaultPanelWidth())
  const [containerHeight, setContainerHeight] = useState(0)
  const [isWebGL2, setIsWebGL2] = useState(false)
  const [proceed, setProceed] = useState(false)

  // True if data is too large
  const [isDataTooLarge, setIsDataTooLarge] = useState(true)

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
    const isSupported: boolean = isWebGL2supported()
    setIsWebGL2(isSupported)
  }, [])

  useLayoutEffect(() => {
    assignNewHeight()
  })

  useEffect(() => {
    if (summary !== undefined && Object.keys(summary).length !== 0) {
      const count = summary['edgeCount'] + summary['nodeCount']
      if (count < 1000) {
        setIsDataTooLarge(false)
      }
    }
  }, [summary])

  useEffect(() => {
    if (!uiState.dataPanelOpen) {
      setLeftWidth(window.innerWidth)
    } else {
      setLeftWidth(getDefaultPanelWidth())
    }
  }, [uiState.dataPanelOpen])

  const setLeftPanelWidth = (state: UIState) =>
    uiStateDispatch({ type: UIStateActions.SET_LEFT_PANEL_WIDTH, uiState: state })

  useEffect(() => {
    setLeftPanelWidth({ ...uiState, leftPanelWidth: leftWidth })
  }, [leftWidth])

  const handleChange = (newWidth) => {
    setLeftWidth(newWidth)
  }

  const splitPaneStyle = {
    height: containerHeight,
  }

  let { count } = fetchParams
  if (!isWebGL2) {
    count = Number.POSITIVE_INFINITY
  }

  // Check Summary error
  if(summaryResponse.isError) {
    return <InitializationPanel message={`${summaryResponse.error}`} error={true} />
  }

  // Step 1: Summary is not available yet
  if (summary === undefined || summaryResponse.isLoading) {
    return <InitializationPanel message={'Loading summary of the network...'} showProgress={true} />
  }

  // Step 2: Summary is ready, but CX is not
  if (summary !== undefined && !proceed) {
    return <InitializationPanel summary={summary} message={'Checking status of network data...'} setProceed={setProceed} />
  }

  if (!proceed) {
    // Canceled.  Go back to original page
    return <InitializationPanel message={'Click to go bak to top page'} showProgress={false} />
  }

  // Case 3: Data is ready.  Need to draw the network (or data/message panels for large ones)
  return (
    <React.Fragment>
      <Title title={`${fetchParams.name} (${uuid})`} />
      <div ref={containerRef} className={classes.mainSplitRoot}>
        <SplitPane
          split="vertical"
          minSize={window.innerWidth * 0.2}
          size={leftWidth}
          onDragFinished={handleChange}
          style={splitPaneStyle}
        >
          {cx === undefined || cxResponse.isLoading || (Array.isArray(cx) && cx.length === 0) ? (
            <InitializationPanel message={'Loading network data from NDEx server...'} showProgress={true} />
          ) : (
            <NetworkPanel cx={cx} renderer={fetchParams.renderer} objectCount={count} isWebGL2={isWebGL2} />
          )}
          <DataPanel uuid={uuid} cx={cx} />
        </SplitPane>
        {uiState.dataPanelOpen ? <div /> : <ClosedPanel />}
      </div>
    </React.Fragment>
  )
}

export default MainSplitPane
