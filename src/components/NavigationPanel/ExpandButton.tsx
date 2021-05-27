import React, { useContext, useState, useEffect } from 'react'
import { IconButton } from '@material-ui/core'
import AppContext from '../../context/AppState'
import Tooltip from '@material-ui/core/Tooltip'
import FullScreenIcon from '@material-ui/icons/Fullscreen'
import ExitFullScreenIcon from '@material-ui/icons/FullscreenExit'
import { fitContent, lockMainWindow } from '../../utils/cyjsUtil'
import { UIStateActions } from '../../reducer/uiStateReducer'
import UIState from '../../model/UIState'

const ExpandButton = () => {
  const { uiState, uiStateDispatch, cyReference, query } = useContext(
    AppContext,
  )
  const { showSearchResult } = uiState

  const [hide, setHide] = useState<boolean>(true)

  useEffect(() => {
    if (query === '' && !showSearchResult) {
      setHide(true)
    } else {
      setHide(false)
    }
  }, [showSearchResult, query])

  const setShowSearchResult = (state: UIState) =>
    uiStateDispatch({
      type: UIStateActions.SET_SHOW_SEARCH_RESULT,
      uiState: state,
    })

  const handleClick = () => {
    setShowSearchResult({ ...uiState, showSearchResult: !showSearchResult })
    setTimeout(() => {
      fitContent(cyReference)
      lockMainWindow(cyReference, !showSearchResult)
    }, 100)
  }

  const tooltip = showSearchResult
    ? 'Maximize the main network view'
    : 'Back to split view'

  if (hide) {
    return <div />
  }

  return (
    <Tooltip title={tooltip} placement="right" arrow>
      <div>
        <IconButton
          color={'secondary'}
          style={{ backgroundColor: 'transparent' }}
          disableFocusRipple={true}
          disableRipple={true}
          onClick={handleClick}
        >
          {showSearchResult ? <FullScreenIcon /> : <ExitFullScreenIcon />}
        </IconButton>
      </div>
    </Tooltip>
  )
}

export default ExpandButton
