import React, { useContext, useState, VFC } from 'react'
import { IconButton, Button } from '@material-ui/core'
import ClearIcon from '@material-ui/icons/Delete'
import { Tooltip } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { getNdexClient } from '../../utils/credentialUtil'
import useNetworkPermissions from '../../hooks/useNetworkPermissions'

import AppContext from '../../context/AppState'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      'text-transform': 'none',
    },
  }),
)

const DeleteDOIButton: VFC<{ uuid: string }> = ({ uuid }) => {
  const classes = useStyles()

  const { ndexCredential, config, summary, setSummary } = useContext(AppContext)
  const permissions = useNetworkPermissions(
    uuid,
    config.ndexHttps,
    'v2',
    ndexCredential,
  )

  const [dialogOpen, setDialogOpen] = useState(false)

  const handleDialog = (): void => {
    setDialogOpen(true)
  }

  const handleDialogCancel = () => {
    setDialogOpen(false)
  }

  const handleDialogOK = () => {
    handleDeleteRequest(() =>
      setSummary({
        ...summary,
        doi: undefined,
      }),
    )

    setDialogOpen(false)
  }

  const handleDeleteRequest = (onSuccess) => {
    const ndexClient = getNdexClient(`${config.ndexHttps}/v2`, ndexCredential)
    ndexClient
      .cancelDOIRequest(uuid)
      .then(onSuccess)
      .catch((err) => {
        console.log(err)
        throw new Error(err)
      })
  }

  if (
    ndexCredential.isLogin &&
    summary !== undefined &&
    permissions &&
    permissions.data === 'ADMIN'
  ) {
    return (
      <React.Fragment>
        <Tooltip title="Cancel DOI request" arrow placement={'left'}>
          <IconButton
            size={'small'}
            onClick={handleDialog}
            className={classes.button}
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="sm"
          aria-labelledby="confirmation-dialog-title"
          open={dialogOpen}
        >
          <DialogTitle id="confirmation-dialog-title">
            Delete DOI Request
          </DialogTitle>
          <DialogContent dividers>
            <Typography>
              This will delete your DOI request, please verify that your
              network's visibility is correct. If you still want a DOI for your
              network, please submit a new request.
            </Typography>
            <br />
            <Typography>Would you like to delete this request?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogCancel}>Cancel</Button>
            <Button onClick={handleDialogOK}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
  return null
}

export default DeleteDOIButton
