import React, { FC, useContext } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { useParams } from 'react-router-dom'

import Snackbar from '@material-ui/core/Snackbar';

import { CyNDExProvider, OpenInCytoscapeButton } from 'cytoscape-explore-components'

import AppContext from '../../context/AppState'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolBar: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      margin: 0,
      padding: 0,
      backgroundColor: 'rgba(255,255,255, 0.3)',
    },
    grow: {
      flexGrow: 1,
    },
    cyLogo: {
      width: '1.2em',
    },
  }),
)

const OpenInCytoscape: FC = () => {
  const classes = useStyles()
  const { uuid } = useParams()

  const { query, queryMode } = useContext(AppContext)

  const [snackMessage, setSnackMessage] = React.useState(undefined);
 
  const onSuccess = () => {
    setSnackMessage('Network opened.');
  }

  const onFailure = (err) => {
    setSnackMessage('Failed to load network: ' + err);
  }

  const handleClose = () => {
    setSnackMessage(undefined);
  }

  const ndexNetworkProperties = {
    uuid: uuid
  }

  return (
    <CyNDExProvider port={1234}>
      <OpenInCytoscapeButton size="small" ndexNetworkProperties={ ndexNetworkProperties } onSuccess={onSuccess} onFailure={onFailure} />
      <Snackbar open={snackMessage} 
        autoHideDuration={6000} 
        onClose={handleClose}
        message={snackMessage} />
    </CyNDExProvider>
  )
}

export default OpenInCytoscape
