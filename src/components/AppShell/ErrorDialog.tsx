import React, { useState, FC } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

export type ErrorDialogProps = {
  open: boolean
  setOpen: Function
}

const ErrorDialog: FC<ErrorDialogProps> = ({ open, setOpen }) => {

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>{'Login Required'}</DialogTitle>
      <DialogContent>
        <DialogContentText>You are trying to access private network data.  Please login to your NDEx account first.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Dismiss
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ErrorDialog
