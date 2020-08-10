import React, { FC, useContext, useEffect, Suspense, useState } from 'react'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import LGRPanel from './LGRPanel'
import CytoscapeRenderer from '../CytoscapeRenderer'
import AppContext from '../../context/AppState'
import SplitPane from 'react-split-pane'
import { useParams } from 'react-router-dom'
import { Typography } from '@material-ui/core'
import useSearch from '../../hooks/useSearch'

import ExpandButton from './ExpandButton'
import Loading from './Loading'
import { SelectionAction, SelectionActions } from '../../reducer/selectionReducer'

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
      borderTop: '1px solid #999999',
      // top: 0,
      // backgroundColor: '#F0F0F0',
      // opacity: 0.5,
    },
    loading: {
      width: '100%',
      backgroundColor: '#999999',
      display: 'grid',
      placeItems: 'center',
    },

    title: {
      position: 'fixed',
      // top: '1em',
      paddingTop: '1em',
      left: '1em',
      color: 'rgba(100,100,100,0.5)',
      zIndex: 100,
      width: '8em',
    },
    expandButton: {
      position: 'fixed',
      bottom: '1em',
      right: '1em',
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

  const {
    query,
    queryMode,
    uiState,
    setCyReference,
    cyReference,
    selection,
    dispatch,
  } = useContext(AppContext)
  const searchResult = useSearch(uuid, query, '', queryMode)

  const subnet = searchResult.data
  let subCx
  if (subnet !== undefined) {
    subCx = subnet.cx
  }

  const mainEventHandlers = {
    setSelectedNodes: (selected) => dispatch({ type: SelectionActions.SET_MAIN_NODES, selected }),
    setSelectedEdges: (selected) => dispatch({ type: SelectionActions.SET_MAIN_EDGES, selected }),
  }
  
  const subEventHandlers = {
    setSelectedNodes: (selected) => dispatch({ type: SelectionActions.SET_SUB_NODES, selected }),
    setSelectedEdges: (selected) => dispatch({ type: SelectionActions.SET_SUB_EDGES, selected }),
  }

  const { showSearchResult } = uiState

  const height = window.innerHeight
  let topHeight = Math.floor(height * 0.7)
  if (!showSearchResult) {
    topHeight = 0
  }
  const bottomHeight = height - topHeight

  const getSub = () => {
    return <Loading message={'Layout'} />
  }

  console.log('-------!! seleciton', selection)
  return (
    <div className={classes.root}>
      <div className={classes.subnet} style={{ height: topHeight }}>
        <div className={classes.expandButton}>
          <ExpandButton />
        </div>

        {busy ? <Loading message={'Layout'} /> : <div />}

        {!showSearchResult ? (
          <div />
        ) : (
          <CytoscapeRenderer
            uuid={uuid}
            cx={subCx}
            eventHandlers={subEventHandlers}
            selectedNodes={[]}
            layoutName={'cose'}
            setBusy={setBusy}
          />
        )}
      </div>
      <div className={classes.lowerPanel} style={{ height: bottomHeight }}>
        {!showSearchResult ? <div /> : <Typography className={classes.title}>Overview</Typography>}
        <CytoscapeRenderer
          uuid={uuid}
          cx={cx}
          cyReference={cyReference}
          setCyReference={setCyReference}
          eventHandlers={mainEventHandlers}
          selectedNodes={[]}
          options={{
            selectable: false,
            locked: true,
            grabbable: false,
            pannable: true,
          }}
        />
      </div>
    </div>
  )
}

export default NewSplitView
