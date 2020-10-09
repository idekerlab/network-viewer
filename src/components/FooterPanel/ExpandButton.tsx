import React, { useContext } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { IconButton } from '@material-ui/core'
import AppContext from '../../context/AppState'
import Tooltip from '@material-ui/core/Tooltip'
import CloseIcon from '@material-ui/icons/FullscreenExit'
import ExpandIcon from '@material-ui/icons/Fullscreen'
import { fitContent, lockMainWindow } from '../../utils/cyjsUtil'
import { UIStateActions } from '../../reducer/uiStateReducer'
import UIState from '../../model/UIState'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      height: '2em',
      width: '2em',
      borderRadius: 2,
      // border: '1px solid #AAAAAA',
    },
  }),
)

const ExpandButton = () => {
  const classes = useStyles()
  const { uiState, uiStateDispatch, cyReference } = useContext(AppContext)

  const setShowSearchResult = (state: UIState) =>
    uiStateDispatch({ type: UIStateActions.SET_SHOW_SEARCH_RESULT, uiState: state })

  const handleClick = () => {
    const current = uiState.showSearchResult

    setShowSearchResult({ ...uiState, showSearchResult: !current })
    setTimeout(() => {
      fitContent(cyReference)
      lockMainWindow(cyReference, !current)
    }, 300)
  }

  if (uiState.showSearchResult) {
    return (
      <Tooltip title="Full screen" placement="top" arrow>
        <IconButton className={classes.button} size="small" onClick={handleClick}>
          <ExpandIcon />
        </IconButton>
      </Tooltip>
    )
  } else {
    return (
      <Tooltip title="Collapse main view" placement="top" arrow>
        <IconButton className={classes.button} size="small" onClick={handleClick}>
          <CloseIcon />
        </IconButton>
      </Tooltip>
    )
  }
}

export default ExpandButton
