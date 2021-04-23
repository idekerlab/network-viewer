import React, { useState, useMemo, useContext } from 'react'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import NetworkPropertyPanel from './NetworkPropertyPanel'
import { useParams } from 'react-router-dom'
import AppContext from '../../context/AppState'
import useAttributes from '../../hooks/useAttributes'
import { getContextFromCx } from '../../utils/contextUtil'
import useNetworkSummary from '../../hooks/useNetworkSummary'
import { Tab, Tabs, Typography } from '@material-ui/core'
import MinimizeButton from './NetworkPropertyPanel/MinimizeButton'
import EntryTable from './EntryTable'

import UIState from '../../model/UIState'
import { UIStateActions } from '../../reducer/uiStateReducer'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      borderBottom: '1px solid rgba(220,220,220,0.7)',
      backgroundColor: '#FEFEFE',
    },
    topBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingRight: theme.spacing(1),
    },
    title: {
      paddingTop: theme.spacing(1),
      paddingLeft: theme.spacing(3),
    },
    tabs: {
      marginTop: theme.spacing(1),
      minHeight: '2.6em',
      backgroundColor: theme.palette.background.default
    },
    tab: {
      minHeight: '2.6em',
      minWidth: '7em'
    }
  }),
)

const TabPanel = (props) => {
  if (props.value === props.index) {
    return props.children
  }
  return null
}

const DataPanel = ({ width, cx, renderer }) => {
  const classes = useStyles()

  const {
    ndexCredential,
    config,
    selectionState,
    uiState,
    uiStateDispatch,
  } = useContext(AppContext)
  const { uuid } = useParams()

  const attributes = useAttributes(uuid, cx, uiState.mainNetworkNotDisplayed)
  const context = useMemo(() => getContextFromCx(cx), [cx])

  const setActiveTab = (state: UIState) => {
    uiStateDispatch({
      type: UIStateActions.SET_ACTIVE_TAB,
      uiState: state,
    })
  }

  const handleChange = (event, newValue) => {
    setActiveTab({ ...uiState, activeTab: newValue })
  }

  const getLetterWidth = (sandbox, letter) => {
    sandbox.innerHTML = `<span>${letter}</span>`
    const el = sandbox.children[0]
    return el.offsetWidth
  }

  const letterWidths = useMemo(() => {
    const widths = {}
    let widthSum = 0
    const sandbox = document.getElementById('sandbox')
    sandbox.style.display = 'block'
    for (let i = 32; i < 127; i++) {
      let letter = String.fromCharCode(i)
      if (letter === ' ') {
        letter = '&nbsp'
      }
      widths[letter] = getLetterWidth(sandbox, letter)
      widthSum += widths[letter]
    }
    sandbox.style.display = 'none'
    widths['default'] = widthSum / (127 - 32)
    return widths
  }, [])

  let nodes = []
  let edges = []
  if (selectionState.lastSelected.fromMain) {
    nodes = selectionState.main['nodes']
    edges = selectionState.main['edges']
  } else {
    nodes = selectionState.sub['nodes']
    edges = selectionState.sub['edges']
  }

  if (renderer !== 'lgr') {
    if (attributes['nodeAttr'] !== undefined) {
      if (nodes.length === 0) {
        nodes = Object.keys(attributes['nodeAttr'])
      }
    }
    if (attributes['edgeAttr'] !== undefined) {
      if (edges.length === 0) {
        edges = Object.keys(attributes['edgeAttr'])
      }
    }
  }

  const summaryResponse = useNetworkSummary(
    uuid,
    config.ndexHttps,
    'v2',
    ndexCredential,
  )
  const summaryResponseData = summaryResponse.data

  return (
    <div className={classes.root} style={{ width: width }}>
      <div className={classes.topBar}>
        <MinimizeButton />
        <Typography variant="h5" className={classes.title}>
          {summaryResponseData['name']}
        </Typography>
      </div>
      <Tabs
        value={uiState.activeTab}
        onChange={handleChange}
        scrollButtons="auto"
        variant="scrollable"
        className={classes.tabs}
      >
        <Tab className={classes.tab} key={'network-tab'} label={'Network'} />
        <Tab className={classes.tab} key={'nodes-tab'} label={'Nodes'} />
        <Tab className={classes.tab} key={'edges-tab'} label={'Edges'} />
      </Tabs>
      <TabPanel value={uiState.activeTab} index={0}>
        <div style={{ width: '100%', overflow: 'auto' }}>
          <NetworkPropertyPanel cx={cx} />
        </div>
      </TabPanel>
      <TabPanel value={uiState.activeTab} index={1}>
        <EntryTable
          key={'selected-nodes'}
          selectedObjects={nodes}
          attributes={attributes.nodeAttr}
          context={context}
          letterWidths={letterWidths}
          label={'Name'}
        />
      </TabPanel>
      <TabPanel value={uiState.activeTab} index={2}>
        <EntryTable
          key={'selected-edges'}
          selectedObjects={edges}
          attributes={attributes.edgeAttr}
          type={'edge'}
          context={context}
          letterWidths={letterWidths}
          label={'Name'}
        />
      </TabPanel>
    </div>
  )
}

export default DataPanel
