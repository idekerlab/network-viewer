import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import { blue } from '@material-ui/core/colors'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles({
  root: {
    padding: '2em',
  },
  message: {
    padding: '2em',
    display: 'grid',
    placeItems: 'center center',
  },
})

export interface SearchHelpProps {
  open: boolean
  onClose: () => void
}

const SearchHelpDialog = (props: SearchHelpProps) => {
  const classes = useStyles()
  const { onClose, open } = props

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog className={classes.root} onClose={handleClose} aria-labelledby="search-help-dialog-title" open={open}>
      <DialogTitle id="search-help">Network Query Modes</DialogTitle>
      <div className={classes.message}>
        <Typography variant="h6">Help message will be displayed here...</Typography>
      </div>
    </Dialog>
  )
}

export default SearchHelpDialog
