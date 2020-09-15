import React, { useContext } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { IconButton } from '@material-ui/core'
import AppContext from '../../context/AppState'
import Tooltip from '@material-ui/core/Tooltip'
import UploadIcon from '@material-ui/icons/CloudUpload'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      height: '2em',
      width: '2em',
      borderRadius: 2,
    },
  }),
)

const SaveNetworkToButton = () => {
  const classes = useStyles()
  const { uiState } = useContext(AppContext)

  const handleClick = () => {
    //Upload to NDEx logic here...
  }

  if (uiState.showSearchResult) {
    return (
      <Tooltip title="Save to your NDEx account" placement="top" arrow>
        <IconButton className={classes.button} size="small" onClick={handleClick}>
          <UploadIcon />
        </IconButton>
      </Tooltip>
    )
  } else {
    return (
        <IconButton className={classes.button} disabled size="small">
          <UploadIcon />
        </IconButton>
    )
  }
}

export default SaveNetworkToButton
