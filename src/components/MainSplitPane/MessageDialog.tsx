import React, { useState, FC } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import { useHistory } from 'react-router-dom'



export type MessageDialogProps = {
  open: boolean
  setOpen: Function
  title?: string
  message?: string
  setProceed?: Function
}

const MessageDialog: FC<MessageDialogProps> = ({ title = '', message = '', open, setOpen, setProceed }) => {
  let history = useHistory()

  const handleProceed = () => {

    if(setProceed !== undefined) {
      setProceed(true)
    }
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false)
    history.goBack()
  }

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="default">
          Cancel
        </Button>

        <Button onClick={handleProceed} color="secondary">
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MessageDialog
