import React, { useState, FC } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

export type MessageDialogProps = {
  open: boolean
  setOpen: Function
  title?: string
  message?: string
}

const MessageDialog: FC<MessageDialogProps> = ({ title='', message='', open, setOpen }) => {
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Dismiss
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MessageDialog
