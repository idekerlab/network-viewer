import React, { FC, useContext, useState, useEffect } from 'react'
import { Grid, makeStyles, Theme, Tooltip } from '@material-ui/core'
import AppContext from '../../../../context/AppState'
import useAttributes from '../../../../hooks/useAttributes'
import { useParams } from 'react-router-dom'
import TargetSelector from './TargetSelector'
import TargetNodes from './TargetNodes'
import QueryState, { DB } from './QueryState'
import ColumnSelector from './ColumnSelector'
import DBSelector from './DBSelector'
import StartQueryButton from './StartQueryButton'
import { buildUrl, getColumnNames } from './query-util'
import useSearch from '../../../../hooks/useSearch'
import { getEntry } from '../../../../utils/cxUtil'

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: '100%',
    padding: theme.spacing(2),
    paddingBottom: 0,
    margin: 0,
  },
  item: {
    paddingLeft: theme.spacing(1),
  },
  flexContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
}))

enum ButtonState {
  ENABLED, // enabled
  NO_NODES_SELECTED, // disabled, no nodes selected
  TOO_MANY_NODES, // disabled, network contains too many nodes to query all
  TOO_MANY_NODES_SELECTED, // disabled, too many nodes selected
}

// Maximum length of the URL
const MAX_URL_LENGTH = 8200

// TODO: tweak this number
const MAX_NODE_COUNT = 500

const QueryPanel: FC<{
  cx: any
  queryState: QueryState
  setQueryState: (QueryState) => void
}> = ({ cx, queryState, setQueryState }) => {
  //Parameters
  const classes = useStyles()
  const {
    selectionState,
    uiState,
    query,
    config,
    ndexCredential,
    queryMode,
  } = useContext(AppContext)
  const { showSearchResult } = uiState
  const { uuid } = useParams()

  // This custom hook always return all node attributes
  const allNodeAttributes = useAttributes(
    uuid,
    cx,
    uiState.mainNetworkNotDisplayed,
  )['nodeAttr']

  // For querying all nodes in query network
  const searchResult = useSearch(
    uuid,
    query,
    config.ndexHttps,
    ndexCredential,
    queryMode,
    config.maxEdgeQuery,
  )

  const [columnNames, setColumnNames] = useState<string[]>([])

  // Enable/disable button based on network and selection state
  const [buttonState, setButtonState] = useState<ButtonState>(
    ButtonState.ENABLED,
  )

  const [percentToReduceQuery, setPercentToReduceQuery] = useState('')
  
  const tooltipMessages = {
    [ButtonState.NO_NODES_SELECTED]: 'Select nodes to run a query.',
    [ButtonState.TOO_MANY_NODES]:
      `This network contains too many nodes to query the ${queryState.column}` +
      ` attribute of all nodes. Try selecting a subset or changing the attribute queried.`,
    [ButtonState.TOO_MANY_NODES_SELECTED]:
      `Too many nodes are selected to run this query.` +
      ` Try selecting less than ${MAX_NODE_COUNT} nodes.`,
  }

  // Extract column names
  useEffect(() => {
    const sortedNames: string[] = getColumnNames(cx)
    setColumnNames(sortedNames)
    // Select "name" if available
    _handleColumnChange('name')
  }, [cx])
  
  // Initialized: Check selection state 
  useEffect(() => {
    // const {target} = queryState
    if(!showSearchResult && selectionState.main['nodes'].length !== 0) {
      _handleTargetChange(TargetNodes.Selected)
    }
    // updateButtonState()
  }, [])

  // Watch change in targets
  useEffect(() => {
    const {target} = queryState
    if(target === TargetNodes.All && showSearchResult) {
      _handleTargetChange(TargetNodes.AllResult)
    }
    updateButtonState()
    console.log('TGT:', target)
  }, [queryState])
  

  const updateButtonState = (): void => {

    const {target} = queryState

    if(showSearchResult) {
      // Sub network query mode
      if(target === TargetNodes.SelectedResult && selectionState.sub['nodes'].length === 0) {
        // No nodes are selected
        setButtonState(ButtonState.NO_NODES_SELECTED)
      } else {
        setButtonState(ButtonState.ENABLED)
      }

    } else {
      // Query on main network

      // too big
      const nodeCount = getEntry('nodes', cx).length
      if(nodeCount > MAX_NODE_COUNT && target === TargetNodes.All) {
        setButtonState(ButtonState.TOO_MANY_NODES)
        return
      } else if(target === TargetNodes.Selected && selectionState.main['nodes'].length > MAX_NODE_COUNT) {
        setButtonState(ButtonState.TOO_MANY_NODES_SELECTED)
        return
      } 

      if(queryState.target === TargetNodes.Selected && selectionState.main['nodes'].length === 0) {
        // No nodes are selected
        setButtonState(ButtonState.NO_NODES_SELECTED)
      } else {
        setButtonState(ButtonState.ENABLED)
      }
    }
  }

  useEffect(() => {
    updateButtonState()
  }, [selectionState])

  const _handleDBChange = (db: DB): void => {
    setQueryState({ ...queryState, db: db })
  }
  const _handleColumnChange = (selectedColumnName: string): void => {
    setQueryState({ ...queryState, column: selectedColumnName })
  }
  const _handleTargetChange = (val: TargetNodes): void => {
    setQueryState({ ...queryState, target: val })
  }

  const _handleClick = () => {
    const subnet = searchResult.data
    let subCx
    if (subnet !== undefined) {
      subCx = subnet['cx']
    }
    // Build query string
    const queryUrl: string = buildUrl(
      queryState,
      allNodeAttributes,
      selectionState,
      subCx,
    )

    // Open in a new page TODO: popup blocker silences this
    window.open(queryUrl, '_blank')
  }

  return (
    <Grid
      className={classes.container}
      container
      spacing={1}
      justify="flex-start"
      alignItems="center"
    >
      <Grid item xs={3}>
        <DBSelector selected={queryState.db} setSelected={_handleDBChange} />
      </Grid>

      <Grid item xs={9} className={classes.item}>
        <ColumnSelector
          columns={columnNames}
          selected={queryState.column}
          setSelected={_handleColumnChange}
        />
      </Grid>

      <Grid item xs={8}>
        <TargetSelector
          selectionState={selectionState}
          showSearchResult={showSearchResult}
          target={queryState.target}
          setTarget={_handleTargetChange}
        />
      </Grid>

      <Grid item xs={4}>
        <StartQueryButton
          enabled={buttonState === ButtonState.ENABLED}
          message={tooltipMessages[buttonState]}
          onClick={_handleClick}
        />
      </Grid>
    </Grid>
  )
}

export default QueryPanel
