import React, { FC, Fragment, useState, useContext } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
import DeleteIcon from '@material-ui/icons/Delete'
import InfoIcon from '@material-ui/icons/InfoOutlined'

import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { Button, IconButton } from '@material-ui/core'
import AppContext from '../../context/AppState'
import SearchHelpDialog from './SearchHelpDialog'
import { fitContent, lockMainWindow } from '../../utils/cyjsUtil'

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
      padding: theme.spacing(0.2),
    },
    search: {
      maxWidth: '65em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    inputRoot: {
      width: '100%',
      color: 'inherit',
    },
    inputInput: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      transition: theme.transitions.create('width'),
      width: '100%',
    },
    formControl: {
      minWidth: '12em',
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

const queryMode = {
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
  const [searchType, setSearchType] = useState(queryMode.direct)

  const { cyReference, setQuery, setQueryMode, setUIState, uiState } = useContext(AppContext)

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

  const handleClick = () => {
    setQuery(rawQuery)
    setUIState({ ...uiState, showSearchResult: true })
    setTimeout(() => {
      fitContent(cyReference)
      lockMainWindow(cyReference, true)
    }, 300)
  }

  const handleClear = () => {
    setRawQuery('')
    setQuery('')
    setDisableQuery(true)
    setUIState({ ...uiState, showSearchResult: false })
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

  return (
    <div className={classes.root}>
      <div className={classes.search}>
        <InputBase
          placeholder="Enter query terms"
          value={rawQuery}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
          onChange={handleQueryChange}
        />
      </div>
      <IconButton size={'small'} disableFocusRipple disableRipple className={classes.button} onClick={handleHelpOpen}>
        <InfoIcon />
      </IconButton>
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
          {Object.keys(queryMode).map((key) => (
            <option key={key} value={key}>
              {queryMode[key]}
            </option>
          ))}
        </Select>
      </FormControl>
      <IconButton
        color="primary"
        size="small"
        disableFocusRipple
        disableRipple
        className={classes.button}
        disabled={disableQuery}
        onClick={handleClick}
      >
        <SearchIcon />
      </IconButton>
      <IconButton
        color="primary"
        size="small"
        disableFocusRipple
        disableRipple
        className={classes.button}
        disabled={disableQuery}
        onClick={handleClear}
      >
        <DeleteIcon />
      </IconButton>
      <SearchHelpDialog onClose={handleHelpClose} open={open} />
    </div>
  )
}

export default SearchBox
