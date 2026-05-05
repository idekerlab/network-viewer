import React, { VFC, useContext, useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { getNdexClient } from '../../utils/credentialUtil'
import AppContext from '../../context/AppState'
import { useParams } from 'react-router-dom'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { getCurrentServer } from '../../utils/locationUtil'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogPaper: {
      borderRadius: 28,
      padding: theme.spacing(2),
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    content: {
      fontSize: '1rem',
      color: theme.palette.text.secondary,
      marginBottom: theme.spacing(3),
    },
    actionButton: {
      borderRadius: 20,
      textTransform: 'none',
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    confirmButton: {
      backgroundColor: '#1a73e8',
      color: 'white',
      '&:hover': {
        backgroundColor: '#1765cc',
      },
    },
  }),
)

const DeleteDialog: VFC<{ open: boolean; setOpen: (boolean) => void }> = ({
  open,
  setOpen,
}) => {
  const classes = useStyles()
  const baseUrl: string = getCurrentServer()
  const trashUrl = `${baseUrl}/trash`

  const { ndexCredential, config, summary } = useContext(AppContext)
  const { uuid } = useParams()
  const [deleted, setDeleted] = useState<boolean>(false)

  const _handleDelete = () => {
    const ndexClient = getNdexClient(`${config.ndexHttps}/v2`, ndexCredential)
    ndexClient
      .deleteNetwork(uuid)
      .then((response) => {
        console.log(response)
        setDeleted(true)
      })
      .catch((err) => {
        console.log(err)
        throw new Error(err)
      })
  }

  const _handleClose = () => {
    setOpen(false)
    if (deleted) {
      setDeleted(false)
    }
  }

  const _handleGoToTrash = () => {
    window.open(trashUrl, '_self')
  }

  const networkName = summary?.name || 'This network'


  return (
    <Dialog
      open={open}
      onClose={_handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{ className: classes.dialogPaper }}
    >
      {!deleted ? (
        <>
          <DialogTitle id="alert-dialog-title" className={classes.title}>
            {'Delete this network'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              className={classes.content}
            >
              This network will be moved to trash. Are you sure you want to
              proceed?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={_handleClose}
              color="default"
              className={classes.actionButton}
            >
              Cancel
            </Button>
            <Button
              onClick={_handleDelete}
              variant="contained"
              className={`${classes.actionButton} ${classes.confirmButton}`}
            >
              Confirm
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogTitle id="alert-dialog-title" className={classes.title}>
            {'File moved to trash'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              className={classes.content}
            >
              "{networkName}" will be in the trash. To access this file, go to
              your trash.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={_handleGoToTrash}
              variant="contained"
              className={`${classes.actionButton} ${classes.confirmButton}`}
              autoFocus
            >
              Go to trash
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}

export default DeleteDialog
