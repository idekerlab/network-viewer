import React, { useContext, useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import AppContext from '../../context/AppState'
import WarningIcon from '@material-ui/icons/Warning'
import { saveQuery } from '../../hooks/useSearch'
import { Button } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import Snackbar from '@material-ui/core/Snackbar'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      boxSizing: 'border-box',
      display: 'grid',
      width: '100%',
      height: '100%',
      placeItems: 'center',
      background: '#FFFFFF',
      zIndex: 0,
    },
    item: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1em',
      width: '60%',
    },
    message: {
      padding: '0.5em',
      color: '#999999',
      textAlign: 'center',
    },
    title: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    arrow1: {
      position: 'fixed',
      color: '#999999',
      bottom: '2vh',
      left: '1vw',
      fontSize: '7em',
    },
    warningIcon: {
      color: 'red',
      fontSize: '7em',
    },
  }),
)

const EdgeLimitExceededPanel = () => {
  const classes = useStyles()

  const { uuid } = useParams()

  const [snackMessage, setSnackMessage] = useState(undefined)

  const { query, queryMode, ndexCredential, config } = useContext(AppContext)

  const handleSave = () => {
    saveQuery(uuid, query, config.ndexHttps, ndexCredential, queryMode).then(
      () => {
        setSnackMessage('Query is being saved to NDEx')
      },
    )
  }

  const handleClose = () => {
    setSnackMessage(undefined)
  }

  return (
    <div className={classes.root}>
      <div className={classes.item}>
        <div className={classes.title}>
          <Typography className={classes.message} variant="h3"></Typography>
        </div>
        <Typography className={classes.message} variant="subtitle1">
          Your query returned more than {config.maxEdgeQuery} and cannot be
          displayed in the browser.
          <br />
          {ndexCredential.authenticated
            ? 'You can save this sub-network to NDEx to continue working with it.'
            : 'Please log in so that the result can be saved to your NDEx account'}
        </Typography>
        {ndexCredential.authenticated && (
          <Button onClick={handleSave} variant="contained">
            Save Result to NDEx
          </Button>
        )}
        <Snackbar
          open={snackMessage != undefined}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={6000}
          onClose={handleClose}
          message={snackMessage}
        />
      </div>
    </div>
  )
}

export default EdgeLimitExceededPanel
