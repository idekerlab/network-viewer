import React, { useContext } from 'react'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import { IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/ArrowRight'
import OpenIcon from '@material-ui/icons/ArrowLeft'
import AppContext from '../../../context/AppState'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      width: '2em',
      margin: 0,
      borderRadius: 3,
      border: '1px solid #999999',
    },
    closeIcon: {
      width: '2em',
    },
  }),
)

const MinimizeButton = (props) => {
  const classes = useStyles()
  const appContext = useContext(AppContext)
  const { setDataPanelOpen, dataPanelOpen } = appContext

  const handleClick = () => {
    setDataPanelOpen(!dataPanelOpen)
  }

  return (
    <IconButton className={classes.button} size="small" onClick={handleClick}>
      {dataPanelOpen ? (
        <CloseIcon className={classes.closeIcon} aria-label="Collapse the panel" color="inherit" />
      ) : (
        <OpenIcon className={classes.closeIcon} aria-label="Collapse the panel" color="inherit" />
      )}
    </IconButton>
  )
}

export default MinimizeButton
