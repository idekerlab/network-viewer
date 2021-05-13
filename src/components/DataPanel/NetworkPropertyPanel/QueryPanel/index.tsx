import React, { FC, useContext, useState, useEffect } from 'react'
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  Select,
  Theme,
  Tooltip,
} from '@material-ui/core'
import AppContext from '../../../../context/AppState'
import useAttributes from '../../../../hooks/useAttributes'
import { useParams } from 'react-router-dom'
import SearchIcon from '@material-ui/icons/Search'
import TargetSelector from './TargetSelector'
import TargetNodes from './TargetNodes'
import QueryState from './QueryState'

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
  formControl: {
    width: '100%',
    '& .MuiInputBase-root': {
      fontSize: 'inherit',
    },
  },
  button: {
    width: '100%',
    '&.MuiButton-contained': {},
  },
  tooltipText: {
    fontSize: '0.875rem',
    textAlign: 'center',
    padding: theme.spacing(0.5),
    lineHeight: 1.15,
  },
  flexContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
}))

const QueryPanel: FC<{
  cx: any
  queryState: QueryState
  setQueryState: (QueryState) => void
}> = ({ cx, queryState, setQueryState }) => {
  //Parameters
  const classes = useStyles()
  const { selectionState, uiState } = useContext(AppContext)

  const { showSearchResult } = uiState

  const { uuid } = useParams()
  const allNodeAttributes = useAttributes(
    uuid,
    cx,
    uiState.mainNetworkNotDisplayed,
  )['nodeAttr']

  useEffect(() => {
    console.log('Q panel init:')
  }, [])

  //State information
  const [initialLoad, setInitialLoad] = useState(true)

  const availableQueries = ['IQuery', 'MSigDB']
  const availableQueryUrls = [
    'http://iquery.ndexbio.org/?genes=',
    'https://www.gsea-msigdb.org/gsea/analysisApi?speciesName=Human&username=ndex_user&op=annotate&geneIdList=',
  ]
  const [chosenQuery, setChosenQuery] = useState(0)

  const [availableAttributes, setAvailableAttributes] = useState([])
  const [chosenAttribute, setChosenAttribute] = useState(0)

  const [chosenSelectionType, setChosenSelectionType] = useState(0)

  const [selectedNodes, setSelectedNodes] = useState([])
  const [queryURL, setQueryURL] = useState('')

  //Button state:
  // 0 = enabled
  // 1 = disabled, no nodes selected
  // 2 = disabled, network contains too many nodes to query all
  // 3 = disabled, too many nodes selected
  const [buttonState, setButtonState] = useState(0)

  const queryDelimiters = [', ', ',']
  const maxQueryLengths = [8200, 8200]

  const [percentToReduceQuery, setPercentToReduceQuery] = useState('')
  const tooltipMessages = [
    <div className={classes.tooltipText}>Select nodes to run a query.</div>,
    <>
      <div className={classes.tooltipText}>
        This network contains too many nodes to query the{' '}
        <strong>{availableAttributes[chosenAttribute]}</strong> attribute of all
        nodes.
      </div>
      <div className={classes.tooltipText}>
        Try selecting a subset or changing the attribute queried.
      </div>
    </>,
    <>
      <div className={classes.tooltipText}>
        Too many nodes are selected to run this query.
      </div>
      <div className={classes.tooltipText}>
        Try narrowing your selection by about {percentToReduceQuery}%, or
        changing the type of query/attribute queried.
      </div>
    </>,
  ]

  //Get available node attributes
  useEffect(() => {
    let nodes = []
    if (chosenSelectionType === 0) {
      //Use all nodes
      if (allNodeAttributes !== undefined) {
        nodes = Object.keys(allNodeAttributes)
      }
    } else {
      //Use selected nodes
      if (selectionState.lastSelected.fromMain) {
        nodes = selectionState.main['nodes']
      } else {
        nodes = selectionState.sub['nodes']
      }
    }
    setSelectedNodes(nodes)

    const availableAttributesTemp = new Set()
    if (allNodeAttributes !== undefined) {
      for (let node of nodes) {
        const nodeAttributes = allNodeAttributes[node]
        if (nodeAttributes !== undefined) {
          const nodeAttributeNames = Array.from(nodeAttributes.keys())
          for (let attributeName of nodeAttributeNames) {
            availableAttributesTemp.add(attributeName)
          }
        }
      }
    }
    //Check if old current attribute is in new list
    const availableAttributesTempList = Array.from(availableAttributesTemp)
    setAvailableAttributes(availableAttributesTempList)

    const newIndex = availableAttributesTempList.indexOf(
      availableAttributes[chosenAttribute],
    )
    if (newIndex === -1) {
      setChosenAttribute(0)
    } else {
      setChosenAttribute(newIndex)
    }
  }, [selectionState, chosenSelectionType])

  //Check what button state should be
  useEffect(() => {
    //Check if any nodes selected
    if (selectedNodes === undefined || selectedNodes.length === 0) {
      setButtonState(1)
    } else {
      //Find node names to build query string
      const nodeNames = []
      const chosenAttributeName = availableAttributes[chosenAttribute]
      if (allNodeAttributes !== undefined) {
        for (let node of selectedNodes) {
          const nodeAttributes = allNodeAttributes[node]
          if (nodeAttributes !== undefined) {
            const attribute = nodeAttributes.get(chosenAttributeName)
            if (attribute !== undefined) {
              nodeNames.push(attribute)
            }
          }
        }
      }
      //Build query string
      let urlString = availableQueryUrls[chosenQuery]
      const delimiter = queryDelimiters[chosenQuery]
      for (let name of nodeNames) {
        urlString += name + delimiter
      }
      urlString = urlString.slice(0, -delimiter.length)
      //Check if currently selected query type has length limit
      if (maxQueryLengths[chosenQuery] == null) {
        //Button enabled
        setButtonState(0)
        setQueryURL(urlString)
      } else {
        //Compare query string to max length
        if (urlString.length > maxQueryLengths[chosenQuery]) {
          //If selection type is 'all'
          if (chosenSelectionType === 0) {
            //Button disabled because selection type is all and query is too long
            setButtonState(2)
            if (initialLoad) {
              setChosenSelectionType(1)
              setInitialLoad(false)
            }
          } else {
            //Button disabled because query is too long
            setButtonState(3)

            //Find out how much query should be decreased by
            const queryOverflow =
              urlString.length - maxQueryLengths[chosenQuery]
            const queryLength =
              urlString.length - availableQueryUrls[chosenQuery].length
            setPercentToReduceQuery(
              Math.round((queryOverflow / queryLength) * 100).toString(),
            )
          }
        } else {
          //Button enabled
          setButtonState(0)
          setQueryURL(urlString)
        }
      }
    }
  }, [selectedNodes, chosenQuery, chosenAttribute])

  //Handle menu changes
  const handleQueryMenuChange = (event) => {
    setChosenQuery(event.target.value)
  }
  const handleAttributeMenuChange = (event) => {
    setChosenAttribute(event.target.value)
  }
  const _handleTargetChange = (val: TargetNodes): void => {
    setQueryState({ ...queryState, target: val })
  }

  //Handle button click and query
  const handleButtonClick = () => {
    window.open(queryURL, '_blank')
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
        <FormControl variant="standard" className={classes.formControl}>
          <InputLabel shrink htmlFor="service-name">
            Database:
          </InputLabel>
          <Select
            native
            value={chosenQuery}
            onChange={handleQueryMenuChange}
            inputProps={{
              name: 'service-name',
              id: 'service-name',
            }}
          >
            {availableQueries.map((name, index) => (
              <option key={name} value={index}>
                {name}
              </option>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={9} className={classes.item}>
        <FormControl variant="standard" className={classes.formControl}>
          <InputLabel shrink htmlFor="attr-selector">
            using the data column
          </InputLabel>
          <Select
            native
            value={chosenAttribute}
            onChange={handleAttributeMenuChange}
            inputProps={{
              name: 'attr-selector',
              id: 'attr-selector',
            }}
          >
            <option value="" disabled>
              Please select
            </option>
            {availableAttributes.map((name, index) => (
              <option key={name} value={index}>
                {name}
              </option>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={8}>
        <TargetSelector
          selectionState={selectionState}
          showSearchResult={showSearchResult}
          selected={queryState.target}
          setSelected={_handleTargetChange}
        />
      </Grid>

      {/* If button state is enabled */}

      <Grid item xs={4}>
        {buttonState === 0 ? (
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            className={classes.button}
            onClick={handleButtonClick}
            startIcon={<SearchIcon />}
          >
            Query
          </Button>
        ) : (
          <Tooltip arrow title={tooltipMessages[buttonState - 1]}>
            <span>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleButtonClick}
                startIcon={<SearchIcon />}
                disabled
              >
                Query
              </Button>
            </span>
          </Tooltip>
        )}
      </Grid>
    </Grid>
  )
}

export default QueryPanel
