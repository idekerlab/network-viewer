import { FC, useState, useContext, useEffect } from 'react'
import { URLSearchParamsInit, useParams, useSearchParams } from 'react-router-dom'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'
import InfoIcon from '@material-ui/icons/InfoOutlined'

import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { IconButton, Tooltip } from '@material-ui/core'
import AppContext from '../../../context/AppState'
import SearchHelpDialog from '../SearchHelpDialog'
import { DownloadButton, DownloadProps } from 'cytoscape-explore-components'
import { fitContent } from '../../../utils/cyjsUtil'

import useSearch from '../../../hooks/useSearch'
import SaveQueryButton from '../SaveQueryButton'
import AdvancedQueryMenu from '../AdvancedQueryMenu'
import UIState from '../../../model/UIState'
import { UIStateActions } from '../../../reducer/uiStateReducer'
import SelectionState from '../../../model/SelectionState'
import { SelectionActions } from '../../../reducer/selectionStateReducer'
import {
  NetworkQueryParams,
} from '../../../utils/NetworkQueryParams'
import { QueryType } from './QueryType'
import { NetworkQuery } from './NetworkQuery'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey[100],
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
      padding: 0,
      paddingRight: theme.spacing(1),
    },
    search: {
      maxWidth: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    inputRoot: {
      width: '100%',
      color: 'inherit',
    },
    inputInput: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      transition: theme.transitions.create('width'),
      width: '100%',
    },
    formControl: {
      minWidth: '15em',
    },
    selectEmpty: {
      marginTop: theme.spacing(0),
    },
    searchType: {
      maxWidth: '12ch',
      padding: 0,
    },
    button: {
      padding: 0,
    },
  }),
)

const SearchBox: FC = () => {
  const classes = useStyles()
  const { uuid } = useParams()

  const [open, setOpen] = useState<boolean>(false)
  const [disableQuery, setDisableQuery] = useState<boolean>(true)
  const [rawQuery, setRawQuery] = useState<string>('')

  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const geneListString: string | null = searchParams.get(
      NetworkQueryParams.Query,
    )
    const queryTypeString: string | null = searchParams.get(
      NetworkQueryParams.QueryType,
    )

    // Check query is available in the serch parameter or not
    if (
      geneListString !== null &&
      geneListString.length !== 0 &&
      queryTypeString !== null &&
      queryTypeString.length !== 0
    ) {
      updateQueryFields(geneListString)
    } else {
      handleClear()
      return
    }

    // Check type of query
    if (queryTypeString !== null || queryTypeString.length !== 0) {
      const targetMode: string | undefined = QueryType[queryTypeString]
      if (targetMode !== undefined) {
        setSearchType(queryTypeString)
        setQueryMode(queryTypeString)
        // Run search only when network is available
        setQuery(geneListString)
        displayResult()  
      }
    }
  }, [searchParams])


  const {
    cyReference,
    query,
    setQuery,
    queryMode,
    setQueryMode,
    uiStateDispatch,
    uiState,
    selectionState,
    selectionStateDispatch,
    ndexCredential,
    config,
    summary,
  } = useContext(AppContext)

  const [searchType, setSearchType] = useState(queryMode)

  const searchResult = useSearch(
    uuid,
    query,
    config.ndexHttps,
    ndexCredential,
    queryMode,
    config.maxEdgeQuery,
  )

  const subnet = searchResult.data
  let subCx
  if (subnet !== undefined) {
    subCx = subnet['cx']
  }

  const edgeLimitExceeded: boolean =
    subnet !== undefined ? subnet['edgeLimitExceeded'] : false
  const summaryObjectCount = summary
    ? summary.subnetworkNodeCount + summary.subnetworkEdgeCount
    : 0

  const data = summaryObjectCount > 0 ? subCx : undefined
  const downloadProps: DownloadProps = {
    data,
    tooltip: 'Download query result as CX',
    fileName: `${uuid} subnet.cx`,
  }

  const handleSearchTypeChange = (evt) => {
    const val = evt.target.value
    setSearchType(val)
    setQueryMode(val)
  }

  const updateQueryFields = (q: string): void => {
    if (q !== undefined && q.length !== 0) {
      setDisableQuery(false)
    } else {
      setDisableQuery(true)
    }
    setRawQuery(q)
  }

  const handleQueryChange = (evt): void => {
    const q: string = evt.target.value
    updateQueryFields(q)
  }

  const setShowSearchResult = (state: UIState) =>
    uiStateDispatch({
      type: UIStateActions.SET_SHOW_SEARCH_RESULT,
      uiState: state,
    })
  const setClearSelection = (state: SelectionState) => {
    selectionStateDispatch({
      type: SelectionActions.CLEAR_ALL_SUB,
      selectionState: state,
    })
    selectionStateDispatch({
      type: SelectionActions.CLEAR_ALL_MAIN,
      selectionState: state,
    })
  }

  const displayResult = (): void => {
    setShowSearchResult({ ...uiState, showSearchResult: true })
    setClearSelection({ ...selectionState })
    setTimeout(() => {
      fitContent(cyReference)
    }, 300)
  }

  const validateQueryType = (queryTypeString: string): QueryType => {
    const defaultQueryType: QueryType = 'direct'
    const queryType: string | undefined = QueryType[queryTypeString]
    if (queryType !== undefined) {
      return queryType as QueryType
    } else {
      return defaultQueryType
    }
  }

  const handleClick = (): void => {
    const queryType: QueryType = validateQueryType(searchType)

    setQuery(rawQuery)
    const networkQuery: NetworkQuery = {
      [NetworkQueryParams.Query]: rawQuery,
      [NetworkQueryParams.QueryType]: queryType,
      [NetworkQueryParams.MaximizeResultView]: true,
    }

    setSearchParams(networkQuery as URLSearchParamsInit)
    displayResult()
  }

  const handleClear = () => {
    setRawQuery('')
    setQuery('')
    setDisableQuery(true)
    setShowSearchResult({ ...uiState, showSearchResult: false })
    setClearSelection({ ...selectionState })
    setTimeout(() => {
      fitContent(cyReference)
      // lockMainWindow(cyReference, false)
    }, 300)
    setSearchParams({})
  }

  const handleHelpClose = () => {
    setOpen(false)
  }
  const handleHelpOpen = () => {
    setOpen(true)
  }

  const handleKeyPress = (e): void => {
    if (rawQuery.length === 0) {
      return
    }

    const key = e.key
    if (key === 'Enter') {
      handleClick()
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.search}>
        <InputBase
          autoFocus={true}
          placeholder="Enter query terms"
          value={rawQuery}
          defaultValue={''}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
          onChange={handleQueryChange}
          onKeyPress={handleKeyPress}
        />
      </div>
      <Tooltip title="Learn more">
        <IconButton
          color="inherit"
          disableFocusRipple
          // disableRipple
          onClick={handleHelpOpen}
        >
          <InfoIcon />
        </IconButton>
      </Tooltip>
      <FormControl variant="standard" className={classes.formControl}>
        <Select
          native
          value={searchType}
          onChange={handleSearchTypeChange}
          label="Search Type"
          inputProps={{
            name: 'search type',
            id: 'search-type',
          }}
        >
          {Object.keys(QueryType).map((key) => (
            <option key={key} value={key}>
              {QueryType[key]}
            </option>
          ))}
        </Select>
      </FormControl>
      <IconButton
        color="inherit"
        disableFocusRipple
        // disableRipple
        disabled={disableQuery}
        onClick={handleClick}
      >
        <SearchIcon />
      </IconButton>
      {!edgeLimitExceeded && <DownloadButton {...downloadProps} />}
      {!edgeLimitExceeded && <SaveQueryButton />}
      <AdvancedQueryMenu />
      <IconButton
        color="inherit"
        disableFocusRipple
        // disableRipple
        className={classes.button}
        disabled={disableQuery}
        onClick={handleClear}
      >
        <CloseIcon />
      </IconButton>
      <SearchHelpDialog onClose={handleHelpClose} open={open} />
    </div>
  )
}

export default SearchBox
