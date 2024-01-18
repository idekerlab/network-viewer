import { useContext, useEffect, useState, useRef } from 'react'
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
import { NodeView, EdgeView } from 'large-graph-renderer'
import ExpandPanelButton from './ExpandPanelButton'

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
      position: 'absolute',
      right: theme.spacing(2),
      top: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      zIndex: 300,
    },
    subnetworkPanel: {
      width: '100%',
      height: '100%',
      border: splitBorder,
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

const NetworkPanel = ({
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

  const {
    query,
    queryMode,
    uiStateDispatch,
    uiState,
    cyDispatch,
    selectionState,
    selectionStateDispatch,
    config,
    ndexCredential,
    summary,
    setSummary,
  } = useContext(AppContext)

  const { maxNumObjects } = config
  const { showSearchResult, maximizeResultView } = uiState

  const defSize = maximizeResultView ? 0 : window.innerHeight * 0.3
  const minSize = maximizeResultView ? 0 : window.innerHeight * 0.1
  const [size, setSize] = useState(defSize)
  const [subHeight, setSubHeight] = useState(0)

  useEffect(() => {
    if (maximizeResultView && showSearchResult) {
      setSize(0)
    } else {
      setSize(window.innerHeight * 0.3)
    }
  }, [maximizeResultView])

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
        selectionStateDispatch({
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
        selectionStateDispatch({
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
      //Set active tab if multiple select
      if (nodes.length > 1 || edges.length > 1) {
        if (lastSelectedType === 'node' && nodes.length > 1) {
          uiStateDispatch({
            type: UIStateActions.SET_ACTIVE_TAB,
            uiState: {
              ...uiState,
              activeTab: 1,
            },
          })
        } else if (lastSelectedType === 'edge' && edges.length > 1) {
          uiStateDispatch({
            type: UIStateActions.SET_ACTIVE_TAB,
            uiState: {
              ...uiState,
              activeTab: 2,
            },
          })
        } else if (nodes.length > 1) {
          uiStateDispatch({
            type: UIStateActions.SET_ACTIVE_TAB,
            uiState: {
              ...uiState,
              activeTab: 1,
            },
          })
        } else {
          uiStateDispatch({
            type: UIStateActions.SET_ACTIVE_TAB,
            uiState: {
              ...uiState,
              activeTab: 2,
            },
          })
        }
      }
      //Handle deselects
      if (uiState.activeTab === 1 && nodes.length <= 1) {
        uiStateDispatch({
          type: UIStateActions.SET_ACTIVE_TAB,
          uiState: {
            ...uiState,
            activeTab: 0,
          },
        })
      } else if (uiState.activeTab === 2 && edges.length <= 1) {
        uiStateDispatch({
          type: UIStateActions.SET_ACTIVE_TAB,
          uiState: {
            ...uiState,
            activeTab: 0,
          },
        })
      }
    },
    clearAll: () => {
      selectionStateDispatch({
        type: SelectionActions.CLEAR_ALL_MAIN,
      })
      uiStateDispatch({
        type: UIStateActions.SET_ACTIVE_TAB,
        uiState: {
          ...uiState,
          activeTab: 0,
        },
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
        selectionStateDispatch({
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
        selectionStateDispatch({
          type: SelectionActions.SET_SUB_NODES_AND_EDGES,
          selectionState: {
            ...selectionState,
            sub: { nodes: nodes, edges: edges },
            lastSelected: { showPropPanel: false },
          },
        })
      }
      //Set active tab if multiple select
      if (nodes.length > 1 || edges.length > 1) {
        if (lastSelectedType !== null) {
          uiStateDispatch({
            type: UIStateActions.SET_ACTIVE_TAB,
            uiState: {
              ...uiState,
              activeTab: lastSelectedType === 'node' ? 1 : 2,
            },
          })
        } else if (nodes.length > 1) {
          uiStateDispatch({
            type: UIStateActions.SET_ACTIVE_TAB,
            uiState: {
              ...uiState,
              activeTab: 1,
            },
          })
        } else {
          uiStateDispatch({
            type: UIStateActions.SET_ACTIVE_TAB,
            uiState: {
              ...uiState,
              activeTab: 2,
            },
          })
        }
      }
    },
    clearAll: () => {
      selectionStateDispatch({
        type: SelectionActions.CLEAR_ALL_SUB,
      })
      uiStateDispatch({
        type: UIStateActions.SET_ACTIVE_TAB,
        uiState: {
          ...uiState,
          activeTab: 0,
        },
      })
    },
  }

  const lgrEventHandlers = {
    setSelectedNodeOrEdge: (id, lastSelectedType, lastSelectedCoordinates) => {
      if (lastSelectedType === 'node') {
        selectionStateDispatch({
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
        selectionStateDispatch({
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
    setSelectedObjects: (nodes: NodeView[], edges: EdgeView[]): void => {
      const nodeIds = nodes.map((nv) => nv.id)
      const edgeIds = edges.map((ev) => ev.id)
      selectionStateDispatch({
        type: SelectionActions.SET_MAIN_NODES_AND_EDGES,
        selectionState: {
          ...selectionState,
          main: {
            nodes: nodeIds,
            edges: edgeIds,
          },
        },
      })
    },
    clearAll: () => {
      selectionStateDispatch({ type: SelectionActions.CLEAR_ALL_MAIN })
      uiStateDispatch({
        type: UIStateActions.SET_ACTIVE_TAB,
        uiState: {
          ...uiState,
          activeTab: 0,
        },
      })
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
    // If query result is maximized, do not display the main network
    if (maximizeResultView) {
      return (
        <EmptyView
          showIcons={false}
          title="Query Result Mode"
          message={'Query result is displayed below'}
        />
      )
    }

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
      let title = 'Large Network Entry Selected'
      let message = `There are ${objectCount} objects in this network and it is too large to display at once. 
          You can use the query functions below to extract sub-networks.`
      if (noView) {
        title = 'No Network View Mode'
        message =
          'To explore this network, you can use the query functions below to extract sub-networks.'
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

  const getSubRenderer = () => {
    // Check the error code 500:
    if (searchResult.error && typeof searchResult.error === 'object' && 'message' in searchResult.error) {
      if (searchResult.error.message === '500') {
        const message = 'Oops! We\'re having trouble connecting to the server.'
        return <Loading message={message} showLoading={false} />
      }
    }

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
      const bgColor = getNetworkBackgroundColor(subCx)
      return (
        <div className={classes.subnetworkPanel}>
          <div className={classes.expandButton}>
            <ExpandPanelButton />
          </div>
          <CytoscapeRenderer
            uuid={uuid}
            cx={subCx}
            eventHandlers={subEventHandlers}
            layoutName={layout}
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
            <NavigationPanel target={'main'} />
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
          <NavigationPanel target={'main'} />
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
