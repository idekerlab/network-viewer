import React, { useState, FC, useEffect, useContext } from 'react'
import MessageDialog from './MessageDialog'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'

import ErrorIcon from '@material-ui/icons/ErrorOutline'
import WarningIcon from '@material-ui/icons/WarningOutlined'

import AppContext from '../../context/AppState'

/**
 *
 * An empty placeholder panel to check network size
 */

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    initPanel: {
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      color: '#AAAAAA',
      display: 'grid',
      placeItems: 'center',
    },
    message: {
      display: 'grid',
      placeItems: 'center',
    },
    errorIcon: {
      fontSize: '20em',
      color: 'red',
    },
    progressIcon: {
      marginTop: '5em',
    },
  }),
)

type InitPanelProps = {
  message: string
  setProceed?: Function
  showProgress?: boolean
  summary?: object
  error?: boolean
  // isDataTooLarge: boolean
  // setIsDataTooLarge: Function
}

const InitPanel: FC<InitPanelProps> = ({ message, showProgress = false, summary, setProceed, error = false }) => {
  const classes = useStyles()
  const { config } = useContext(AppContext)

  const [open, setOpen] = useState(false)

  const [dialogTitle, setDialogTitle] = useState('')
  const [dialogMessage, setDialogMessage] = useState('')

  useEffect(() => {
    if (summary !== undefined) {
      const total = summary['nodeCount'] + summary['edgeCount']

      if (total <= config.warningThreshold) {
        const hasLayout = summary['hasLayout']

        if (!hasLayout) {
          setDialogTitle(`No layout available`)
          setDialogMessage('Do you want to load the network anyway? (Random layout will be applied to the network)')
          setOpen(true)
        } else {
          // Small network.  Just load it.
          setProceed(true)
        }
      } else {
        // Network is very large
        setDialogMessage(`Large network detected: ${total}`)
        setOpen(true)
      }
    }
  }, [summary])

  const handleClose = () => {
    // setIsDataTooLarge(false)
    setOpen(false)
  }

  if (error) {
    return (
      <div className={classes.initPanel}>
        <div className={classes.message}>
          <ErrorIcon fontSize="inherit" color="error" className={classes.errorIcon} />
          <Typography variant="h5">{message}</Typography>
          <Typography variant="h6">
            Please reload this page, or click <a href={`${config.ndexHttps}`}>here</a> to go back to home page
          </Typography>
        </div>
      </div>
    )
  }
  return (
    <React.Fragment>
      <MessageDialog
        setProceed={setProceed}
        open={open}
        setOpen={handleClose}
        title={dialogTitle}
        message={dialogMessage}
      />
      <div className={classes.initPanel}>
        <div className={classes.message}>
          <Typography variant="h5">{message}</Typography>
          {showProgress ? (
            <CircularProgress color={'secondary'} disableShrink className={classes.progressIcon} />
          ) : (
            <div />
          )}
        </div>
      </div>
    </React.Fragment>
  )
}

export default InitPanel
