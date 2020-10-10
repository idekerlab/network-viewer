import React, { useState, FC } from 'react'
import MessageDialog from '../MessageDialog'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'

/**
 *
 * An empty placeholder panel to check network size
 */

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    initPanel: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      color: '#AAAAAA',
      display: 'grid',
      placeItems: 'center',
    },
    message: {
      height: '10em',
      display: 'grid',
      placeItems: 'center',
    },
  }),
)

type InitPanelProps = {
  message: string
  showProgress: boolean
  // isDataTooLarge: boolean
  // setIsDataTooLarge: Function
}

const InitPanel: FC<InitPanelProps> = ({ message, showProgress }) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    // setIsDataTooLarge(false)
  }

  return (
    <React.Fragment>
      <MessageDialog
        open={open}
        setOpen={handleClose}
        title="Large Network Data"
        message={'You are about to load a large network data (nodes and edges)'}
      />
      <div className={classes.initPanel}>
        <div className={classes.message}>
          <Typography variant="h5">{message}</Typography>
          {showProgress ? <CircularProgress color={'secondary'} disableShrink /> : <div />}
        </div>
      </div>
    </React.Fragment>
  )
}

export default InitPanel
