import React, { FC, useContext } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { useParams } from 'react-router-dom'

import Snackbar from '@material-ui/core/Snackbar'

import { CyNDExProvider, OpenInCytoscapeButton } from 'cytoscape-explore-components'

import useSearch from '../../hooks/useSearch'

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
  const { uuid } = useParams()

  const { query, queryMode, ndexCredential, config } = useContext(AppContext)

  const { data } = useSearch(uuid, query, config.ndexHttps, ndexCredential, queryMode, config.maxEdgeQuery)

  const useQueryResult = data !== undefined && data['cx'] ;

  const subCx = data !== undefined && !data['edgeLimitExceeded'] ? data['cx'] : undefined

  const fetchCX = () =>
    new Promise((resolve, reject) => {
      if (subCx) {
        resolve(subCx)
      } else {
        reject('No search result is available')
      }
    })

  console.log('Open in Cytoscape useSearch: ' + (subCx !== undefined))

  const [snackMessage, setSnackMessage] = React.useState(undefined)

  const onSuccess = () => {
    setSnackMessage('Network opened.')
  }

  const onFailure = (err) => {
    setSnackMessage('Failed to load network: ' + err)
  }

  const handleClose = () => {
    setSnackMessage(undefined)
  }

  const ndexNetworkProperties = {
    uuid: uuid,
  }

  return (
    <CyNDExProvider port={1234}>
      {useQueryResult 
      ? (
        subCx ? <OpenInCytoscapeButton size="small" fetchCX={fetchCX} onSuccess={onSuccess} onFailure={onFailure} />
        : null
      ) : (
        <OpenInCytoscapeButton
          size="small"
          ndexNetworkProperties={ndexNetworkProperties}
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
      )}
      <Snackbar open={snackMessage != undefined} autoHideDuration={6000} onClose={handleClose} message={snackMessage} />
    </CyNDExProvider>
  )
}

export default OpenInCytoscape
