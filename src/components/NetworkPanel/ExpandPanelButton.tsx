import { useContext } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/ExpandLess'
import ExpandIcon from '@material-ui/icons/ExpandMore'
import AppContext from '../../context/AppState'
import Tooltip from '@material-ui/core/Tooltip'
import UIState from '../../model/UIState'
import { UIStateActions } from '../../reducer/uiStateReducer'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: 0,
      padding: 0,
    },
    icon: {
      width: theme.spacing(6),
      height: theme.spacing(6),
      borderRadius: theme.spacing(1),
      border: '2px solid',
    },
  }),
)

const ExpandPanelButton = (): JSX.Element => {
  const classes = useStyles()
  const { uiState, uiStateDispatch } = useContext(AppContext)
  const { maximizeResultView, showSearchResult } = uiState

  /**
   * Expand / collapse the main network view
   */
  const handleClick = () => {
    const newUIState: UIState = {
      ...uiState,
      maximizeResultView: !maximizeResultView,
    }
    uiStateDispatch({
      type: UIStateActions.SET_MAXIMIZE_RESULT_VIEW,
      uiState: newUIState,
    })
  }

  if (maximizeResultView && showSearchResult) {
    return (
      <Tooltip title="Show main network view" placement={'bottom'} arrow>
        <IconButton className={classes.button} onClick={handleClick}>
          <ExpandIcon
            color={'secondary'}
            className={classes.icon}
            aria-label="Collapse the panel"
          />
        </IconButton>
      </Tooltip>
    )
  } else if (showSearchResult) {
    return (
      <Tooltip title="Hide main network view" placement={'bottom'} arrow>
        <IconButton
          color={'secondary'}
          className={classes.button}
          size={'medium'}
          disableFocusRipple={true}
          disableRipple={true}
          onClick={handleClick}
        >
          <CloseIcon className={classes.icon} aria-label="Expand the panel" />
        </IconButton>
      </Tooltip>
    )
  } else {
    return null
  }
}

export default ExpandPanelButton
