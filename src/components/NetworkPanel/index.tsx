import React, { FC, useContext, useEffect, Suspense, useState } from 'react'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import LGRPanel from './LGRPanel'
import CytoscapeRenderer from '../CytoscapeRenderer'
import AppContext from '../../context/AppState'
import { useParams } from 'react-router-dom'
import { Typography } from '@material-ui/core'
import useSearch from '../../hooks/useSearch'

import Loading from './Loading'
import { SelectionAction, SelectionActions } from '../../reducer/selectionReducer'
import CyReference from '../../model/CyReference'
import { CyActions } from '../../reducer/cyReducer'
import NavigationPanel from '../NavigationPanel'
import Popup from '../Popup'
import { getCyjsLayout, getEdgeCount, getLgrLayout, getNetworkBackgroundColor, getNodeCount } from '../../utils/cxUtil'
import EmptyView from './EmptyView'
import { UIStateActions } from '../../reducer/uiStateReducer'
import UIState from '../../model/UIState'
import { isWebGL2supported } from '../../utils/browserTest'
import MessageDialog from '../MessageDialog'

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
    },
    lowerPanel: {
      flexGrow: 1,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
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
  cx: object[]
  objectCount: number
  isWebGL2: boolean
}

const NetworkPanel: FC<ViewProps> = ({ renderer, cx, objectCount, isWebGL2 }: ViewProps) => {
  const classes = useStyles()
  const { uuid } = useParams()

  const [busy, setBusy] = useState(false)

  const {
    query,
    queryMode,
    uiStateDispatch,
    uiState,
    cyDispatch,
    selection,
    dispatch,
    config,
    ndexCredential,
    summary,
    setSummary,
  } = useContext(AppContext)

  const searchResult = useSearch(uuid, query, '', ndexCredential, queryMode)

  const { maxNumObjects, viewerThreshold } = config

  const subnet = searchResult.data
  let subCx
  if (subnet !== undefined) {
    subCx = subnet['cx']
  }

  useEffect(() => {
    if (subCx !== undefined) {
      setSummary({ ...summary, subnetworkNodeCount: getNodeCount(subCx), subnetworkEdgeCount: getEdgeCount(subCx) })
    }
  }, [searchResult])

  const setShowPropPanelTrue = (state: UIState) =>
    uiStateDispatch({ type: UIStateActions.SET_SHOW_PROP_PANEL_TRUE, uiState: state })

  const setShowPropPanelFalse = (state: UIState) =>
    uiStateDispatch({ type: UIStateActions.SET_SHOW_PROP_PANEL_FALSE, uiState: state })

  const updatePanelState = (selected, x, y) => {
    if (selected !== undefined && selected.length !== 0) {
      setShowPropPanelTrue({ ...uiState, pointerPosition: { x: x, y: y } })
    } else {
      setShowPropPanelFalse({ ...uiState })
    }
  }
  const mainEventHandlers = {
    setSelectedNodes: (selected) => {
      return dispatch({ type: SelectionActions.SET_MAIN_NODES, selected })
    },
    setSelectedEdges: (selected) => {
      return dispatch({ type: SelectionActions.SET_MAIN_EDGES, selected })
    },
    setLastSelectedNode: (selected, event) => {
      if (event !== undefined) {
        updatePanelState(selected, event.renderedPosition.x, event.renderedPosition.y)
      }
      return dispatch({ type: SelectionActions.SET_LAST_SELECTED_NODE, selected, from: 'main' })
    },
    setLastSelectedEdge: (selected, event) => {
      if (event !== undefined) {
        updatePanelState(selected, event.renderedPosition.x, event.renderedPosition.y)
      }
      return dispatch({ type: SelectionActions.SET_LAST_SELECTED_EDGE, selected, from: 'main' })
    },
    setLastSelectedFrom: (selected, event) => {
      if (event !== undefined) {
        updatePanelState(selected, event.renderedPosition.x, event.renderedPosition.y)
      }
      return dispatch({ type: SelectionActions.SET_LAST_SELECTED_FROM, from: 'main' })
    },
  }

  const subEventHandlers = {
    //setSelectedNodes: (selected) => dispatch({ type: SelectionActions.SET_SUB_NODES, selected }),
    //setSelectedEdges: (selected) => dispatch({ type: SelectionActions.SET_SUB_EDGES, selected }),
    setSelectedNodes: (selected) => {
      return dispatch({ type: SelectionActions.SET_SUB_NODES, selected })
    },
    setSelectedEdges: (selected) => {
      return dispatch({ type: SelectionActions.SET_SUB_EDGES, selected })
    },
    setLastSelectedNode: (selected, event) => {
      if (event !== undefined) {
        updatePanelState(selected, event.renderedPosition.x, event.renderedPosition.y)
      }
      return dispatch({ type: SelectionActions.SET_LAST_SELECTED_NODE, selected, from: 'sub' })
    },
    setLastSelectedEdge: (selected, event) => {
      if (event !== undefined) {
        updatePanelState(selected, event.renderedPosition.x, event.renderedPosition.y)
      }
      return dispatch({ type: SelectionActions.SET_LAST_SELECTED_EDGE, selected, from: 'sub' })
    },
    setLastSelectedFrom: (selected, event) => {
      if (event !== undefined) {
        updatePanelState(selected, event.renderedPosition.x, event.renderedPosition.y)
      }
      return dispatch({ type: SelectionActions.SET_LAST_SELECTED_FROM, from: 'sub' })
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
          title="Browser not Supported"
          message={`Your browser cannot display large network data. Please use supported browsers, such as Chrome or Firefox, to view large networks.`}
        />
      )
    } else if (objectCount > maxNumObjects) {
      return (
        <EmptyView
          title="Data is too large"
          message={`There are ${objectCount} objects in this network and it is too large to display. 
          Please use query function below to extract subnetworks.`}
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
          eventHandlers={mainEventHandlers}
          selectedNodes={selection.main.nodes}
          selectedEdges={selection.main.edges}
          backgroundColor={bgColor}
          layoutName={layout}
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
      {selection.lastSelected.nodes.length > 0 ? <Popup cx={cx} /> : <Popup cx={cx} objectType={'edge'} />}

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
