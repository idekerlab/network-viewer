import React, { useContext } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/ArrowRight'
import OpenIcon from '@material-ui/icons/ArrowLeft'
import AppContext from '../../../context/AppState'
import Tooltip from '@material-ui/core/Tooltip'
import UIState from '../../../model/UIState'
import { UIStateActions } from '../../../reducer/uiStateReducer'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      height: '3em',
      width: '1em',
      margin: 0,
      borderRadius: 2,
      border: '1px solid #AAAAAA',
    },
    closeIcon: {
      width: '1em',
    },
  }),
)

const MinimizeButton = () => {
  const classes = useStyles()
  const appContext = useContext(AppContext)
  const { uiState, uiStateDispatch } = appContext

  const setDataPanelOpen = (state: UIState) =>
    uiStateDispatch({ type: UIStateActions.SET_DATA_PANEL_OPEN, uiState: state })

  const handleClick = () => {
    setDataPanelOpen({ ...uiState, dataPanelOpen: !uiState.dataPanelOpen })
  }

  if (uiState.dataPanelOpen) {
    return (
      <Tooltip title="Hide Data Panel" placement="left" arrow>
        <IconButton className={classes.button} size="small" onClick={handleClick}>
          <CloseIcon className={classes.closeIcon} aria-label="Collapse the panel" color="inherit" />
        </IconButton>
      </Tooltip>
    )
  } else {
    return (
      <Tooltip title="Show Data Panel" placement="left" arrow>
        <IconButton className={classes.button} size="small" onClick={handleClick}>
          <OpenIcon className={classes.closeIcon} aria-label="Collapse the panel" color="inherit" />
        </IconButton>
      </Tooltip>
    )
  }
}

export default MinimizeButton
