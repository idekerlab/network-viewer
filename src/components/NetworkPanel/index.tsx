import React, { FC, useContext, useEffect, Suspense, useState } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import LGRPanel from './LGRPanel'
import CytoscapeRenderer from '../CytoscapeRenderer'
import AppContext from '../../context/AppState'
import { useParams } from 'react-router-dom'
import { Typography } from '@material-ui/core'
import useSearch from '../../hooks/useSearch'

import Loading from './Loading'
import { SelectionActions } from '../../reducer/selectionStateReducer'
import CyReference from '../../model/CyReference'
import { CyActions } from '../../reducer/cyReducer'
import { getCyjsLayout, getEdgeCount, getLgrLayout, getNetworkBackgroundColor, getNodeCount } from '../../utils/cxUtil'
import EmptyView from './EmptyView'
import Popup from '../Popup'
import NavigationPanel from '../NavigationPanel'
import { isNull } from 'util'

const splitBorder = '1px solid #BBBBBB'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rootA: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
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

  const searchResult = useSearch(uuid, query, config.ndexHttps, ndexCredential, queryMode)

  const { maxNumObjects } = config

  const subnet = searchResult.data
  let subCx
  if (subnet !== undefined) {
    subCx = subnet['cx']
    setSubCx(subCx)
  }

  useEffect(() => {
    if (subCx !== undefined) {
      setSummary({ ...summary, subnetworkNodeCount: getNodeCount(subCx), subnetworkEdgeCount: getEdgeCount(subCx) })
    }
  }, [searchResult])

  const mainEventHandlers = {
    setSelectedNodesAndEdges: (nodes, edges, lastSelectedType, lastSelectedId, lastSelectedCoordinates) => {
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
    setSelectedNodesAndEdges: (nodes, edges, lastSelectedType, lastSelectedId, lastSelectedCoordinates) => {
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

  const setMain = (cy: CyReference) => cyDispatch({ type: CyActions.SET_MAIN, cyReference: cy })
  const setSub = (cy: CyReference) => cyDispatch({ type: CyActions.SET_SUB, cyReference: cy })

  const { showSearchResult } = uiState

  let topHeight: string = '30%'
  let bottomHeight: string = '70%'
  if (!showSearchResult) {
    topHeight = '100%'
    bottomHeight = '0%'
  }

  const getMainRenderer = (renderer: string) => {
    // Make sure renderer can display network
    if (!isWebGL2) {
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
    } else if (objectCount > maxNumObjects || cxDataSize > config.maxDataSize || noView) {
      let title = 'Network data is too large'
      let message = `There are ${objectCount} objects in this network and it is too large to display. 
          You can use the query functions below to extract sub-networks.`
      if (noView) {
        title = 'No network view mode'
        message= 'You can use the query functions below to extract sub-networks.'
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
    if (subCx === undefined && showSearchResult) {
      // let showLoading = busy
      let message = 'Applying layout...'
      return <Loading message={message} showLoading={true} />
    }

    const count = getNodeCount(subCx) + getEdgeCount(subCx)

    if (count === 0 && showSearchResult) {
      return <Loading message={'No nodes matching your query were found in this network.'} showLoading={false} />
    }

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
  }

  return (
    <div className={classes.rootA}>
      <Popup cx={objectCount > maxNumObjects ? subCx : cx} />
      <div className={classes.lowerPanel} style={{ height: topHeight }}>
        {renderer !== 'lgr' ? <NavigationPanel target={'main'} /> : <div />}
        {!showSearchResult ? <div /> : <Typography className={classes.title}>Overview</Typography>}
        {getMainRenderer(renderer)}
      </div>
      <div className={classes.subnet} style={{ height: bottomHeight }}>
        {showSearchResult ? <NavigationPanel target={'sub'} /> : <div />}
        {getSubRenderer()}
      </div>
    </div>
  )
}

export default NetworkPanel
