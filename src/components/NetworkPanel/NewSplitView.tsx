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
import MessageDialog from '../MessageDialog'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    subnet: {
      width: '100%',
      flexGrow: 2,
    },
    lowerPanel: {
      width: '100%',
      flexGrow: 1,
      borderTop: '2px solid #AAAAAA',
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
      // width: '8em'
    },
  }),
)

/**
 *
 * For now, Upper panel always uses Cyjs.
 *
 * @param props
 */
const NewSplitView = ({ renderer, cx }) => {
  const classes = useStyles()
  const { uuid } = useParams()

  const [busy, setBusy] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const { query, queryMode, setUIState, uiState, cyReference, cyDispatch, selection, dispatch } = useContext(AppContext)
  const searchResult = useSearch(uuid, query, '', queryMode)

  const subnet = searchResult.data
  let subCx
  if (subnet !== undefined) {
    subCx = subnet['cx']
  }

  const mainEventHandlers = {
    setSelectedNodes: (selected, event) => {
      if (event !== undefined) {
        const node = event.target
        if (node !== undefined) {
          setUIState({
            ...uiState,
            pointerPosition: node.renderedPosition(),
            showPropPanel: true,
            lastSelectWasNode: true,
          })
        } else {
          setUIState({ ...uiState, showPropPanel: false })
        }
      } else {
        setUIState({ ...uiState, showPropPanel: false })
      }
      return dispatch({ type: SelectionActions.SET_MAIN_NODES, selected })
    },
    //setSelectedEdges: (selected, event) => dispatch({ type: SelectionActions.SET_MAIN_EDGES, selected }),
    setSelectedEdges: (selected, event) => {
      if (event !== undefined) {
        const edge = event.target
        if (edge !== undefined) {
          console.log(event)
          console.log(event.renderedPosition.x)
          setUIState({
            ...uiState,
            pointerPosition: { x: event.renderedPosition.x, y: event.renderedPosition.y },
            showPropPanel: true,
            lastSelectWasNode: false,
          })
        } else {
          setUIState({ ...uiState, showPropPanel: false })
        }
      } else {
        setUIState({ ...uiState, showPropPanel: false })
      }

      return dispatch({ type: SelectionActions.SET_MAIN_EDGES, selected })
    },
  }

  const subEventHandlers = {
    setSelectedNodes: (selected) => dispatch({ type: SelectionActions.SET_SUB_NODES, selected }),
    setSelectedEdges: (selected) => dispatch({ type: SelectionActions.SET_SUB_EDGES, selected }),
  }

  const setMain = (cy: CyReference) => cyDispatch({ type: CyActions.SET_MAIN, cyReference: cy })
  const setSub = (cy: CyReference) => cyDispatch({ type: CyActions.SET_SUB, cyReference: cy })

  const { showSearchResult } = uiState

  const height = window.innerHeight
  let topHeight = Math.floor(height * 0.7)
  if (!showSearchResult) {
    topHeight = 0
  }
  const bottomHeight = height - topHeight

  const getMainRenderer = (renderer: string) => {
    if (renderer !== 'lgr') {
      return (
        <CytoscapeRenderer
          uuid={uuid}
          cx={cx}
          cyReference={cyReference}
          setCyReference={setMain}
          eventHandlers={mainEventHandlers}
        />
      )
    } else {
      return (
        <LGRPanel
          cx={cx}
          eventHandlers={mainEventHandlers}
          selectedNodes={selection.main.nodes}
          selectedEdges={selection.main.edges}
        />
      )
    }
  }

  const getSubRenderer = () => {
    if (subCx === undefined && showSearchResult) {
      let showLoading = busy
      let message = 'No query result yet'
      if (busy) {
        message = 'Applying layout...'
      }
      return <Loading message="No search result yet" showLoading={showLoading} />
    }

    return (
      <CytoscapeRenderer
        uuid={uuid}
        cx={subCx}
        eventHandlers={subEventHandlers}
        selectedNodes={[]}
        layoutName={'cose'}
        setBusy={setBusy}
        setCyReference={setSub}
      />
    )
  }

  let lowerOpacity = 1
  if (showSearchResult) {
    lowerOpacity = 0.8
  }

  return (
    <div className={classes.root}>
      <Popup cx={cx} />
      <div style={{ height: '20px', width: '20px', backgroundColor: 'blue' }}></div>
      <MessageDialog open={openDialog} setOpen={setOpenDialog} />

      <div className={classes.subnet} style={{ height: topHeight }}>
        {showSearchResult ? <NavigationPanel target={'sub'} /> : <div />}
        {getSubRenderer()}
      </div>
      <div className={classes.lowerPanel} style={{ height: bottomHeight, opacity: lowerOpacity }}>
        <NavigationPanel target={'main'} />
        {!showSearchResult ? <div /> : <Typography className={classes.title}>Overview</Typography>}
        {getMainRenderer(renderer)}
      </div>
    </div>
  )
}

export default NewSplitView
