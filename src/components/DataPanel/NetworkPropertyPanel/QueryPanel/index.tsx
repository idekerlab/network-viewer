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

  const { db, column, target } = queryState

  // This custom hook always return all node attributes
  const allNodeAttributes = useAttributes(
    uuid,
    cx,
    uiState.mainNetworkNotDisplayed,
  )['nodeAttr']

  const searchResult = useSearch(
    uuid,
    query,
    config.ndexHttps,
    ndexCredential,
    queryMode,
    config.maxEdgeQuery,
  )

  const { data } = searchResult

  const [columnNames, setColumnNames] = useState<string[]>([])
  const [buttonState, setButtonState] = useState<ButtonState>(
    ButtonState.ENABLED,
  )

  const queryDelimiters = [', ', ',']
  const maxQueryLengths = [8200, 8200]

  const [percentToReduceQuery, setPercentToReduceQuery] = useState('')
  const tooltipMessages = {
    [ButtonState.NO_NODES_SELECTED]: 'Select nodes to run a query.',
    [ButtonState.TOO_MANY_NODES]:
      `This network contains too many nodes to query the ${column}` +
      ` attribute of all nodes. Try selecting a subset or changing the attribute queried.`,
    [ButtonState.TOO_MANY_NODES_SELECTED]:
      `Too many nodes are selected to run this query.` +
      `Try narrowing your selection by about ${percentToReduceQuery}%, or changing the type of query/attribute queried.`,
  }

  // Extract column names
  useEffect(() => {
    const sortedNames: string[] = getColumnNames(cx)
    setColumnNames(sortedNames)
    // Select "name" if available
    _handleColumnChange('name')
  }, [cx])

  // Get available node attributes
  useEffect(() => {
    // const columnNames = getAttributeValues(allNodeAttributes)
    // let nodes = []
    // if (target === TargetNodes.All) {
    //   //Use all nodes
    //   if (allNodeAttributes !== undefined) {
    //     nodes = Object.keys(allNodeAttributes)
    //   }
    // } else {
    //   //Use selected nodes
    //   if (selectionState.lastSelected.fromMain) {
    //     nodes = selectionState.main['nodes']
    //   } else {
    //     nodes = selectionState.sub['nodes']
    //   }
    // }
    // setSelectedNodes(nodes)
    // const availableAttributesTemp = new Set()
    // if (allNodeAttributes !== undefined) {
    //   for (let node of nodes) {
    //     const nodeAttributes = allNodeAttributes[node]
    //     if (nodeAttributes !== undefined) {
    //       const nodeAttributeNames = Array.from(nodeAttributes.keys())
    //       for (let attributeName of nodeAttributeNames) {
    //         availableAttributesTemp.add(attributeName)
    //       }
    //     }
    //   }
    // }
    // //Check if old current attribute is in new list
    // const availableAttributesTempList = Array.from(availableAttributesTemp)
    // setAvailableAttributes(availableAttributesTempList)
    // const newIndex = availableAttributesTempList.indexOf(
    //   availableAttributes[column],
    // )
    // // if (newIndex === -1) {
    // //   setChosenAttribute(0)
    // // } else {
    // //   setChosenAttribute(newIndex)
    // // }
  }, [selectionState, column])

  //Check what button state should be
  useEffect(() => {
    // //Check if any nodes selected
    // if (selectedNodes === undefined || selectedNodes.length === 0) {
    //   setButtonState(ButtonState.NO_NODES_SELECTED)
    // } else {
    //   //Find node names to build query string
    //   const nodeNames = []
    //   const chosenAttributeName = availableAttributes[chosenAttribute]
    //   if (allNodeAttributes !== undefined) {
    //     for (let node of selectedNodes) {
    //       const nodeAttributes = allNodeAttributes[node]
    //       if (nodeAttributes !== undefined) {
    //         const attribute = nodeAttributes.get(chosenAttributeName)
    //         if (attribute !== undefined) {
    //           nodeNames.push(attribute)
    //         }
    //       }
    //     }
    //   }
    //   //Build query string
    //   let urlString = availableQueryUrls[chosenQuery]
    //   const delimiter = queryDelimiters[chosenQuery]
    //   for (let name of nodeNames) {
    //     urlString += name + delimiter
    //   }
    //   urlString = urlString.slice(0, -delimiter.length)
    //   //Check if currently selected query type has length limit
    //   if (maxQueryLengths[chosenQuery] === null) {
    //     //Button enabled
    //     setButtonState(ButtonState.ENABLED)
    //     setQueryURL(urlString)
    //   } else {
    //     //Compare query string to max length
    //     if (urlString.length > maxQueryLengths[chosenQuery]) {
    //       //If selection type is 'all'
    //       if (chosenSelectionType === 0) {
    //         //Button disabled because selection type is all and query is too long
    //         setButtonState(ButtonState.TOO_MANY_NODES)
    //         if (initialLoad) {
    //           setChosenSelectionType(1)
    //           setInitialLoad(false)
    //         }
    //       } else {
    //         //Button disabled because query is too long
    //         setButtonState(ButtonState.TOO_MANY_NODES_SELECTED)
    //         //Find out how much query should be decreased by
    //         const queryOverflow =
    //           urlString.length - maxQueryLengths[chosenQuery]
    //         const queryLength =
    //           urlString.length - availableQueryUrls[chosenQuery].length
    //         setPercentToReduceQuery(
    //           Math.round((queryOverflow / queryLength) * 100).toString(),
    //         )
    //       }
    //     } else {
    //       //Button enabled
    //       setButtonState(ButtonState.ENABLED)
    //       setQueryURL(urlString)
    //     }
    //   }
    // }
  }, [])
  // }, [selectedNodes, chosenQuery, chosenAttribute])

  const _handleDBChange = (db: DB): void => {
    setQueryState({ ...queryState, db })
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
          selected={queryState.target}
          setSelected={_handleTargetChange}
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
