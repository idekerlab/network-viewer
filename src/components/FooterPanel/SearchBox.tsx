import React, { FC, Fragment, useState, useContext } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
import InfoIcon from '@material-ui/icons/InfoOutlined'

import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { Button, IconButton } from '@material-ui/core'
import AppContext from '../../context/AppState'
import SearchHelpDialog from './SearchHelpDialog'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '70ch',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey[200],
      marginLeft: theme.spacing(2),
    },
    search: {
      width: '100%',
      height: '3em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    searchIcon: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      height: '100%',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
      minWidth: '15em',
    },
    selectEmpty: {
      marginTop: theme.spacing(0),
    },
    searchType: {
      width: '20ch',
      padding: 0,
    },
    button: {
      margin: theme.spacing(1),
      width: '15em',
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
  const [rawQuery, setRawQuery] = useState('')
  const [searchType, setSearchType] = useState(queryMode.direct)

  const appContext = useContext(AppContext)
  const { uuid, setSelectedNodes, setQuery, setQueryMode } = appContext


  const handleSearchTypeChange = (evt) => {
    const val = evt.target.value
    console.log('ST ===========', val)
    setSearchType(val)
    setQueryMode(val)
  }
  const handleQueryChange = (evt) => {
    const q = evt.target.value
    setRawQuery(q)
  }

  const handleClick = () => {
    // TODO: Validate here

    console.log('-------Start Search ------')
    setQuery(rawQuery)
    // console.log('NETQUERY ===========', data, appContext)
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
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
          onChange={handleQueryChange}
        />
      </div>
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
            <option key={key} value={key}>{queryMode[key]}</option>
          ))}
        </Select>
      </FormControl>
      <IconButton size="small" onClick={handleHelpOpen}>
        <InfoIcon color="secondary" />
      </IconButton>
      <Button
        className={classes.button}
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<SearchIcon />}
        onClick={handleClick}
      >
        Query
      </Button>
      <SearchHelpDialog onClose={handleHelpClose} open={open} />
    </div>
  )
}

export default SearchBox
