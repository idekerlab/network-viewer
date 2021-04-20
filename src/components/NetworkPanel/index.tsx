import React, {
  FC,
  useContext,
  useEffect,
  Suspense,
  useState,
  useRef,
} from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import LGRPanel from './LGRPanel'
import CytoscapeRenderer from '../CytoscapeRenderer'
import AppContext from '../../context/AppState'
import { useParams } from 'react-router-dom'
import { Typography } from '@material-ui/core'
import useSearch from '../../hooks/useSearch'
import { AutoSizer } from 'react-virtualized'
import Loading from './Loading'
import { SelectionActions } from '../../reducer/selectionStateReducer'
import CyReference from '../../model/CyReference'
import { CyActions } from '../../reducer/cyReducer'
import {
  getCyjsLayout,
  getEdgeCount,
  getLgrLayout,
  getNetworkBackgroundColor,
  getNodeCount,
} from '../../utils/cxUtil'
import EmptyView from './EmptyView'
import Popup from '../Popup'
import NavigationPanel from '../NavigationPanel'
import EdgeLimitExceededPanel from '../FooterPanel/EdgeLimitExceededPanel'
import SplitPane from 'react-split-pane'
import UIState from '../../model/UIState'
import { UIStateActions } from '../../reducer/uiStateReducer'

const splitBorder = '1px solid #BBBBBB'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rootA: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    },
    subnet: {
      width: '100%',
      zIndex: 10,
    },
    lowerPanel: {
      flexGrow: 1,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      height: '100%',
      zIndex: 100,
    },
    title: {
      position: 'fixed',
      paddingTop: '1em',
      left: '1em',
      color: 'rgba(100,100,100,0.7)',
      zIndex: 100,
      width: '8em',
    },
    expandButton: {
      position: 'fixed',
      bottom: '5em',
      left: '1em',
      color: 'rgba(100,100,100,1)',
      zIndex: 100,
    },
  }),
)

const LAYOUT_TH = 1000

type ViewProps = {
  renderer: string
  objectCount: number
  cxDataSize: number
  isWebGL2: boolean
  cx: object[]
  setSubCx: Function
  noView: boolean
}

const NetworkPanel: FC<ViewProps> = ({
  cx,
  renderer,
  objectCount,
  cxDataSize,
  isWebGL2,
  setSubCx,
  noView,
}: ViewProps) => {
  const classes = useStyles()
  const { uuid } = useParams()
  const [busy, setBusy] = useState(false)
  const defSize = window.innerHeight * 0.3
  const minSize = window.innerHeight * 0.1
  const [size, setSize] = useState(defSize)
  const [subHeight, setSubHeight] = useState(0)

  const {
    query,
    queryMode,
    uiStateDispatch,
    uiState,
    cyDispatch,
    cyReference,
    selectionState,
    selectionStateDispatch,
    config,
    ndexCredential,
    summary,
    setSummary,
  } = useContext(AppContext)

  const searchResult = useSearch(
    uuid,
    query,
    config.ndexHttps,
    ndexCredential,
    queryMode,
    config.maxEdgeQuery,
  )

  const handleDrag = (newSize) => {
    setSize(newSize)
  }

  const { maxNumObjects } = config
  const { showSearchResult } = uiState

  const usePrevious = (val) => {
    const ref = useRef()
    useEffect(() => {
      ref.current = val
    })
    return ref.current
  }

  const subnet = searchResult.data
  let subCx
  if (subnet !== undefined) {
    subCx = subnet['cx']
    setSubCx(subCx)
  }

  const last = usePrevious(subCx)

  const getObjectCount = (countFunction, subCx) => {
    const count = countFunction(subCx)
    return count ? count : 0
  }

  const edgeLimitExceeded =
    subnet !== undefined ? subnet['edgeLimitExceeded'] : false

  useEffect(() => {
    if (subCx === undefined) {
      return
    }

    if (last !== subCx) {
      const subnetworkNodeCount = getObjectCount(getNodeCount, subCx)
      const subnetworkEdgeCount = getObjectCount(getEdgeCount, subCx)

      setSummary({
        ...summary,
        subnetworkNodeCount: subnetworkNodeCount,
        subnetworkEdgeCount: subnetworkEdgeCount,
      })
    }
  }, [searchResult])

  const mainEventHandlers = {
    setSelectedNodesAndEdges: (
      nodes,
      edges,
      lastSelectedType,
      lastSelectedId,
      lastSelectedCoordinates,
    ) => {
      if (lastSelectedType) {
        return selectionStateDispatch({
          type: SelectionActions.SET_MAIN_NODES_AND_EDGES,
          selectionState: {
            ...selectionState,
            main: { nodes: nodes, edges: edges },
            lastSelected: {
              isNode: lastSelectedType === 'node',
              fromMain: true,
              id: lastSelectedId,
              showPropPanel: true,
              coordinates: lastSelectedCoordinates,
            },
          },
        })
      } else {
        return selectionStateDispatch({
          type: SelectionActions.SET_MAIN_NODES_AND_EDGES,
          selectionState: {
            ...selectionState,
            main: { nodes: nodes, edges: edges },
            lastSelected: {
              isNode: null,
              fromMain: true,
              id: null,
              showPropPanel: false,
              coordinates: null,
            },
          },
        })
      }
    },
    clearAll: () => {
      return selectionStateDispatch({
        type: SelectionActions.CLEAR_ALL_MAIN,
      })
    },
  }

  const subEventHandlers = {
    setSelectedNodesAndEdges: (
      nodes,
      edges,
      lastSelectedType,
      lastSelectedId,
      lastSelectedCoordinates,
    ) => {
      if (lastSelectedType) {
        return selectionStateDispatch({
          type: SelectionActions.SET_SUB_NODES_AND_EDGES,
          selectionState: {
            ...selectionState,
            sub: { nodes: nodes, edges: edges },
            lastSelected: {
              isNode: lastSelectedType === 'node',
              fromMain: false,
              id: lastSelectedId,
              showPropPanel: true,
              coordinates: lastSelectedCoordinates,
            },
          },
        })
      } else {
        return selectionStateDispatch({
          type: SelectionActions.SET_SUB_NODES_AND_EDGES,
          selectionState: {
            ...selectionState,
            sub: { nodes: nodes, edges: edges },
            lastSelected: { showPropPanel: false },
          },
        })
      }
    },
    clearAll: () => {
      return selectionStateDispatch({
        type: SelectionActions.CLEAR_ALL_SUB,
      })
    },
  }

  const lgrEventHandlers = {
    setSelectedNodeOrEdge: (id, lastSelectedType, lastSelectedCoordinates) => {
      if (lastSelectedType === 'node') {
        return selectionStateDispatch({
          type: SelectionActions.SET_MAIN_NODES_AND_EDGES,
          selectionState: {
            ...selectionState,
            main: {
              nodes: [id],
              edges: [],
            },
            lastSelected: {
              isNode: true,
              fromMain: true,
              id: id,
              showPropPanel: true,
              coordinates: lastSelectedCoordinates,
            },
          },
        })
      } else {
        return selectionStateDispatch({
          type: SelectionActions.SET_MAIN_NODES_AND_EDGES,
          selectionState: {
            ...selectionState,
            main: {
              nodes: [],
              edges: [id],
            },
            lastSelected: {
              isNode: false,
              fromMain: true,
              id: id,
              showPropPanel: true,
              coordinates: lastSelectedCoordinates,
            },
          },
        })
      }
    },
    clearAll: () => {
      return selectionStateDispatch({ type: SelectionActions.CLEAR_ALL_MAIN })
    },
  }

  const setMain = (cy: CyReference) =>
    cyDispatch({ type: CyActions.SET_MAIN, cyReference: cy })
  const setSub = (cy: CyReference) =>
    cyDispatch({ type: CyActions.SET_SUB, cyReference: cy })
  const setMainNetworkNotDisplayed = (state: UIState) =>
    uiStateDispatch({
      type: UIStateActions.SET_MAIN_NETWORK_NOT_DISPLAYED,
      uiState: state,
    })

  const getMainRenderer = (renderer: string) => {
    // Make sure renderer can display network
    if (!isWebGL2 && objectCount > config.viewerThreshold) {
      if (!uiState.mainNetworkNotDisplayed) {
        setMainNetworkNotDisplayed({
          ...uiState,
          mainNetworkNotDisplayed: true,
        })
      }
      return (
        <EmptyView
          showIcons={!uiState.showSearchResult}
          title="Browser not supported"
          message={`Your browser cannot display large network data. 
            Please use supported browsers, such as Chrome or Firefox, 
            to view large networks. (Still, you can query the network 
              using the query function below.)`}
        />
      )
    } else if (
      objectCount > maxNumObjects ||
      cxDataSize > config.maxDataSize ||
      noView
    ) {
      if (!uiState.mainNetworkNotDisplayed) {
        setMainNetworkNotDisplayed({
          ...uiState,
          mainNetworkNotDisplayed: true,
        })
      }
      let title = 'Network data is too large'
      let message = `There are ${objectCount} objects in this network and it is too large to display. 
          You can use the query functions below to extract sub-networks.`
      if (noView) {
        title = 'No network view mode'
        message =
          'You can use the query functions below to extract sub-networks.'
      }
      return (
        <EmptyView
          showIcons={!uiState.showSearchResult}
          title={title}
          message={message}
        />
      )
    }

    const bgColor = getNetworkBackgroundColor(cx)
    if (renderer !== 'lgr') {
      const layout = getCyjsLayout(cx, LAYOUT_TH)
      return (
        <CytoscapeRenderer
          uuid={uuid}
          cx={cx}
          layoutName={layout}
          setCyReference={setMain}
          eventHandlers={mainEventHandlers}
          backgroundColor={bgColor}
        />
      )
    } else {
      const layout = getLgrLayout(cx)
      return (
        <LGRPanel
          cx={cx}
          eventHandlers={lgrEventHandlers}
          selectedNodes={selectionState.main.nodes}
          selectedEdges={selectionState.main.edges}
          backgroundColor={bgColor}
          layoutName={layout}
          pickable={!showSearchResult}
        />
      )
    }
  }

  let border = 'none'
  const getSubRenderer = () => {
    // Case 1:
    if (!searchResult.isLoading && subCx === undefined && showSearchResult) {
      const message = 'No search result yet.'
      return <Loading message={message} showLoading={false} />
    }

    if (searchResult.isLoading && subCx === undefined && showSearchResult) {
      // let showLoading = busy
      let message = 'Loading subnetwork...'
      return <Loading message={message} showLoading={true} />
    }

    if (edgeLimitExceeded) {
      return <EdgeLimitExceededPanel />
    }

    const count = summary.subnetworkNodeCount + summary.subnetworkEdgeCount

    if (count === 0 && showSearchResult) {
      return (
        <Loading
          message={'No nodes matching your query were found in this network.'}
          showLoading={false}
        />
      )
    }

    if (
      searchResult.status === 'success' &&
      !searchResult.isLoading &&
      subCx !== undefined &&
      showSearchResult
    ) {
      const layout = getCyjsLayout(subCx, LAYOUT_TH)
      // For showing border between top and bottom panels
      border = splitBorder
      const bgColor = getNetworkBackgroundColor(subCx)
      return (
        <div style={{ width: '100%', height: '100%', borderTop: border }}>
          <CytoscapeRenderer
            uuid={uuid}
            cx={subCx}
            eventHandlers={subEventHandlers}
            layoutName={layout}
            setBusy={setBusy}
            setCyReference={setSub}
            backgroundColor={bgColor}
          />
        </div>
      )
    } else {
      const message = 'Could not get the query result.  Please try again.'
      return <Loading message={message} showLoading={true} />
    }
  }

  const topStyle = { background: '#FFFFFF', zIndex: 0 }
  const bottomStyle = { background: '#FFFFFF', zIndex: 10 }
  return (
    <div className={classes.rootA}>
      <Popup
        cx={uiState.mainNetworkNotDisplayed ? subCx : cx}
        subHeight={subHeight}
      />
      {showSearchResult ? (
        <SplitPane
          split="horizontal"
          pane2Style={bottomStyle}
          pane1Style={topStyle}
          size={size}
          minSize={minSize}
          maxSize={0}
          onDragFinished={handleDrag}
        >
          <div className={classes.lowerPanel}>
            {renderer !== 'lgr' ? <NavigationPanel target={'main'} /> : <div />}
            {!showSearchResult ? (
              <div />
            ) : (
              <Typography className={classes.title}>Overview</Typography>
            )}
            {getMainRenderer(renderer)}
          </div>
          <AutoSizer disableWidth>
            {({ height, width }) => {
              if (height !== subHeight) {
                setSubHeight(height)
              }
              return (
                <div className={classes.subnet} style={{ height: height }}>
                  {showSearchResult ? (
                    <NavigationPanel target={'sub'} />
                  ) : (
                    <div />
                  )}
                  {getSubRenderer()}
                </div>
              )
            }}
          </AutoSizer>
        </SplitPane>
      ) : (
        <div className={classes.lowerPanel}>
          {renderer !== 'lgr' ? <NavigationPanel target={'main'} /> : <div />}
          {!showSearchResult ? (
            <div />
          ) : (
            <Typography className={classes.title}>Overview</Typography>
          )}
          {getMainRenderer(renderer)}
        </div>
      )}
    </div>
  )
}

export default NetworkPanel
