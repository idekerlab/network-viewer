import React, { FC, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'
import InfoIcon from '@material-ui/icons/InfoOutlined'

import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { IconButton, Tooltip } from '@material-ui/core'
import AppContext from '../../context/AppState'
import SearchHelpDialog from './SearchHelpDialog'
import { DownloadButton, DownloadProps } from 'cytoscape-explore-components'
import { fitContent, lockMainWindow } from '../../utils/cyjsUtil'

import useSearch from '../../hooks/useSearch'
import SaveQueryButton from './SaveQueryButton'
import AdvancedQueryMenu from './AdvancedQueryMenu'
import UIState from '../../model/UIState'
import { UIStateActions } from '../../reducer/uiStateReducer'

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
      padding: theme.spacing(0),
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
      width: '2em',
      padding: 0,
    },
  }),
)

const queryModes = {
  direct: 'Direct',
  firstStepNeighborhood: '1-Step Neighborhood',
  firstStepAdjacent: '1-step adjacent',
  interconnect: 'Interconnect',
  twoStepNeighborhood: '2-step neighborhood',
  twoStepAdjacent: '2-step adjacent',
}

const SearchBox: FC = () => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [disableQuery, setDisableQuery] = useState(true)
  const [rawQuery, setRawQuery] = useState('')

  const { uuid } = useParams()

  const {
    cyReference,
    query,
    setQuery,
    queryMode,
    setQueryMode,
    uiStateDispatch,
    uiState,
    ndexCredential,
    config,
    summary
  } = useContext(AppContext)

  const [searchType, setSearchType] = useState(queryMode)

  const searchResult = useSearch(uuid, query, config.ndexHttps, ndexCredential, queryMode, config.maxEdgeQuery)

  const subnet = searchResult.data
  let subCx
  if (subnet !== undefined) {
    subCx = subnet['cx']
  }

  const edgeLimitExceeded: boolean = subnet !== undefined ? subnet['edgeLimitExceeded'] : false
  const summaryObjectCount = summary ? summary.subnetworkNodeCount + summary.subnetworkEdgeCount : 0;

  const downloadProps: DownloadProps = {
    data: subCx,
    tooltip: 'Download query result as CX',
    fileName: `${uuid} subnet.cx`,
  }

  const handleSearchTypeChange = (evt) => {
    const val = evt.target.value
    setSearchType(val)
    setQueryMode(val)
  }
  const handleQueryChange = (evt) => {
    const q: string = evt.target.value
    if (q !== undefined && q.length !== 0) {
      setDisableQuery(false)
    } else {
      setDisableQuery(true)
    }
    setRawQuery(q)
  }

  const setShowSearchResult = (state: UIState) =>
    uiStateDispatch({ type: UIStateActions.SET_SHOW_SEARCH_RESULT, uiState: state })

  const handleClick = () => {
    setQuery(rawQuery)
    setShowSearchResult({ ...uiState, showSearchResult: true })
    setTimeout(() => {
      fitContent(cyReference)
      lockMainWindow(cyReference, true)
    }, 300)
  }

  const handleClear = () => {
    setRawQuery('')
    setQuery('')
    setDisableQuery(true)
    setShowSearchResult({ ...uiState, showSearchResult: false })
    setTimeout(() => {
      fitContent(cyReference)
      lockMainWindow(cyReference, false)
    }, 300)
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
        <IconButton size={'small'} disableFocusRipple disableRipple className={classes.button} onClick={handleHelpOpen}>
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
          {Object.keys(queryModes).map((key) => (
            <option key={key} value={key}>
              {queryModes[key]}
            </option>
          ))}
        </Select>
      </FormControl>
      <IconButton
        color="secondary"
        size="small"
        disableFocusRipple
        disableRipple
        className={classes.button}
        disabled={disableQuery}
        onClick={handleClick}
      >
        <SearchIcon />
      </IconButton>
      {!edgeLimitExceeded && summaryObjectCount > 0 && <DownloadButton {...downloadProps} />}
      {!edgeLimitExceeded && summaryObjectCount > 0 && <SaveQueryButton /> }
      {summaryObjectCount > 0 && <AdvancedQueryMenu /> }
      <IconButton
        color="secondary"
        size="small"
        disableFocusRipple
        disableRipple
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
