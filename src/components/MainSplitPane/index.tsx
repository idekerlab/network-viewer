import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useLayoutEffect,
} from 'react'
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

import { convertError } from '../../utils/error/errorHandler'

import InitializationPanel from './InitializationPanel'
import NDExError from '../../utils/error/NDExError'
import ErrorMessage from '../../utils/error/ErrorMessage'

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
      zIndex: 100,
      display: 'flex',
      height: '100%',
      flexDirection: 'column',
      position: 'relative',
    },
    leftPanel: {
      display: 'flex',
      flexDirection: 'column',
    },
  }),
)

const getDefaultPanelWidth = (): number => {
  return Math.floor(window.innerWidth * 0.35)
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
  const { uiState, ndexCredential, config, uiStateDispatch } = useContext(
    AppContext,
  )
  const maxObj = config.maxNumObjects
  const th = config.viewerThreshold

  const summaryResponse = useNetworkSummary(
    uuid,
    config.ndexHttps,
    V2,
    ndexCredential,
  )

  const { isLoading, isError, isLoadingError } = summaryResponse
  const summary: object = summaryResponse.data
  const fetchParams = getFetchParams(summary, th)

  // First, give null as UUID to hold immediate loading.
  const [curUuid, setCurUuid] = useState(null)
  const cxResponse = useCx(
    curUuid,
    config.ndexHttps,
    V2,
    ndexCredential,
    maxObj,
    fetchParams.count,
    fetchParams.cxVersion,
  )

  const originalCx: object[] = cxResponse.data

  // Local states
  const [rightWidth, setRightWidth] = useState(getDefaultPanelWidth())
  const [containerHeight, setContainerHeight] = useState(0)
  const [isWebGL2, setIsWebGL2] = useState(false)
  const [count, setCount] = useState(0)
  const [cxDataSize, setCxDataSize] = useState(0)
  const [proceed, setProceed] = useState(false)
  const [noView, setNoView] = useState(false)

  const windowWidth = useWindowWidth()
  const [subCx, setSubCx] = useState(null)

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
      const cxSize = summary['cx2FileSize']
      setCount(count)
      setCxDataSize(cxSize)

      if (count < config.maxNumObjects && cxDataSize < config.maxDataSize) {
        if (isWebGL2 && !noView) {
          setCurUuid(uuid)
        } else if (!isWebGL2 && count < config.viewerThreshold) {
          setCurUuid(uuid)
        }
      }
    }
  }, [summary])

  useEffect(() => {
    if (!uiState.dataPanelOpen && rightWidth > 0) {
      setRightWidth(0)
    } else if (uiState.dataPanelOpen) {
      setRightWidth(getDefaultPanelWidth())
    }
  }, [uiState.dataPanelOpen])

  const setRightPanelWidth = (state: UIState) =>
    uiStateDispatch({
      type: UIStateActions.SET_RIGHT_PANEL_WIDTH,
      uiState: state,
    })

  const setDataPanelOpen = (state: UIState) =>
    uiStateDispatch({
      type: UIStateActions.SET_DATA_PANEL_OPEN,
      uiState: state,
    })

  useEffect(() => {
    setRightPanelWidth({ ...uiState, rightPanelWidth: rightWidth })
  }, [rightWidth])

  const handleChange = (newWidth) => {
    const newRightWidth = windowWidth - newWidth
    if (newRightWidth <= 0) {
      setDataPanelOpen({ ...uiState, dataPanelOpen: false })
    } else if (!uiState.dataPanelOpen) {
      setDataPanelOpen({ ...uiState, dataPanelOpen: true })
    }
    setRightWidth(newRightWidth)
  }

  const splitPaneStyle = {
    height: containerHeight,
  }

  const getNetworkPanel = () => {
    // If data is huge, just return Network panel
    if (config.maxDataSize < cxDataSize || config.maxNumObjects < count) {
      return (
        <NetworkPanel
          noView={noView}
          cx={originalCx}
          renderer={fetchParams.renderer}
          objectCount={count}
          cxDataSize={cxDataSize}
          isWebGL2={isWebGL2}
          setSubCx={setSubCx}
        />
      )
    } else if (originalCx === undefined || cxResponse.isLoading) {
      return (
        <InitializationPanel
          message={'Loading network data from NDEx server...'}
          showProgress={true}
          setProceed={setProceed}
        />
      )
    }
    return (
      <NetworkPanel
        noView={noView}
        cx={originalCx}
        renderer={fetchParams.renderer}
        objectCount={count}
        cxDataSize={cxDataSize}
        isWebGL2={isWebGL2}
        setSubCx={setSubCx}
      />
    )
  }

  const getBase = () => {
    return (
      <React.Fragment>
        <Title title={`${fetchParams.name} (${uuid})`} />
        <div ref={containerRef} className={classes.mainSplitRoot}>
          <SplitPane
            split="vertical"
            minSize={windowWidth * 0.2}
            size={windowWidth - rightWidth}
            onDragFinished={handleChange}
            style={splitPaneStyle}
            maxSize={0}
          >
            {getNetworkPanel()}
            {uiState.dataPanelOpen ? (
              <DataPanel
                width={rightWidth}
                cx={uiState.mainNetworkNotDisplayed ? subCx : originalCx}
              />
            ) : (
              <ClosedPanel />
            )}
          </SplitPane>
        </div>
      </React.Fragment>
    )
  }

  // Check Summary error
  if (summaryResponse.isError) {
    const { error } = summaryResponse
    const ndexError = error as NDExError
    const errorMessage: ErrorMessage = convertError(ndexError)
    return (
      <InitializationPanel
        message={errorMessage.message}
        subMessage={errorMessage.originalMessage}
        optionalMessage={errorMessage.optionalMessage}
        code={errorMessage.code}
        error={true}
        setProceed={setProceed}
      />
    )
  }

  // Step 1: Summary is not available yet
  if (summary === undefined || isLoading) {
    return (
      <InitializationPanel
        message={'Loading summary of the network...'}
        showProgress={true}
        setProceed={setProceed}
      />
    )
  }

  if (cxResponse.isError) {
    if (
      cxResponse.error['response'] &&
      cxResponse.error['response'].data &&
      cxResponse.error['response'].data.message !==
        'CX2 network is not available for this network.'
    ) {
      return (
        <InitializationPanel
          summary={summary}
          message={`Missing visualization data. Unable to visualize this network.`}
          error={true}
          setProceed={setProceed}
        />
      )
    } else {
      console.log('CXResponse error data:', cxResponse.error['response'].data)
      return (
        <InitializationPanel
          summary={summary}
          message={`${cxResponse.error}`}
          error={true}
          setProceed={setProceed}
        />
      )
    }
  }
  // Step 2: Summary is ready, but CX is not
  if (summary !== undefined && !proceed) {
    // Too big to display
    if (config.maxNumObjects < count || config.maxDataSize < cxDataSize) {
      return getBase()
    }

    return (
      <InitializationPanel
        summary={summary}
        message={'Checking status of network data...'}
        setProceed={setProceed}
        setNoView={setNoView}
      />
    )
  }

  // Initiate loading if browser is compatible.
  // Step 4: Data is ready.  Need to draw the network
  return getBase()
}

const getWindowWidth = () => {
  const { innerWidth: windowWidth } = window
  return windowWidth
}

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(getWindowWidth())

  useEffect(() => {
    function handleResize() {
      setWindowWidth(getWindowWidth())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowWidth
}

export default MainSplitPane
