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
import Snackbar from '@material-ui/core/Snackbar'
import { getCurrentServer } from '../../utils/locationUtil'

const DeleteDialog: VFC<{ open: boolean; setOpen: (boolean) => void }> = ({
  open,
  setOpen,
}) => {
  const baseUrl: string = getCurrentServer()
  const usersAccountUrl = `${baseUrl}/#/myAccount`

  const { ndexCredential, config } = useContext(AppContext)
  const { uuid } = useParams()
  const [openFeedback, setOpenFeedback] = useState<boolean>(false)

  const _handleDelete = () => {
    const ndexClient = getNdexClient(`${config.ndexHttps}/v2`, ndexCredential)
    ndexClient
      .deleteNetwork(uuid)
      .then((response) => {
        console.log(response)
        setOpenFeedback(true)
      })
      .catch((err) => {
        console.log(err)
        throw new Error(err)
      })
    setOpen(false)
  }

  const _handleClose = () => {
    setOpen(false)
  }

  const _handleCloseFeedback = () => {
    setOpenFeedback(false)
    setTimeout(() => {
      window.open(usersAccountUrl, '_self')
    }, 1100)
  }


  return (
    <>
      <Dialog
        open={open}
        onClose={_handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Delete this network'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This network will be permanently deleted from NDEx. Are you sure you
            want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={_handleClose} color="default" autoFocus>
            Cancel
          </Button>
          <Button onClick={_handleDelete} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openFeedback}
        autoHideDuration={1000}
        message="The network successfully deleted. Redirecting to your account page..."
        onClose={_handleCloseFeedback}
      />
    </>
  )
}

export default DeleteDialog
