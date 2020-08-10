import React, { useContext } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { IconButton } from '@material-ui/core'
import AppContext from '../../context/AppState'
import Tooltip from '@material-ui/core/Tooltip'
import CloseIcon from '@material-ui/icons/ExpandLess'
import ExpandIcon from '@material-ui/icons/ExpandMore'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      height: '3em',
      width: '3em',
      margin: 0,
      borderRadius: 2,
      border: '1px solid #AAAAAA',
    },
  }),
)

const ExpandButton = () => {
  const classes = useStyles()
  const { uiState, setUIState } = useContext(AppContext)

  const handleClick = () => {
    
    setUIState({...uiState, showSearchResult: !uiState.showSearchResult})
  }

  if (uiState.showSearchResult) {
    return (
      <Tooltip title="Hide sub network" placement="left" arrow>
        <IconButton className={classes.button} size="small" onClick={handleClick}>
          <CloseIcon />
        </IconButton>
      </Tooltip>
    )
  } else {
    return (
      <Tooltip title="Show query result" placement="left" arrow>
        <IconButton className={classes.button} size="small" onClick={handleClick}>
          <ExpandIcon aria-label='Expand sub network' />
        </IconButton>
      </Tooltip>
    )
  }
}

export default ExpandButton
