import React, { FC, useContext } from 'react'
import { useParams } from 'react-router-dom'
import Snackbar from '@material-ui/core/Snackbar'

import {
  CyNDExProvider,
  OpenInCytoscapeButton,
} from 'cytoscape-explore-components'

import useSearch from '../../hooks/useSearch'
import useNetworkMetaData from '../../hooks/useNetworkMetaData'

import AppContext from '../../context/AppState'

const OpenInCytoscape: FC = () => {
  const { uuid } = useParams()

  const { query, queryMode, ndexCredential, config, summary } = useContext(
    AppContext,
  )

  const { data } = useSearch(
    uuid,
    query,
    config.ndexHttps,
    ndexCredential,
    queryMode,
    config.maxEdgeQuery,
  )

  const useQueryResult = data !== undefined && data['cx']

  const subCx =
    data !== undefined && !data['edgeLimitExceeded'] ? data['cx'] : undefined

  const fetchCX = () =>
    new Promise((resolve, reject) => {
      if (subCx) {
        resolve(subCx)
      } else {
        reject('No search result is available')
      }
    })

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

  const metaDataResponse = useNetworkMetaData(
    uuid,
    config.ndexHttps,
    'v2',
    ndexCredential,
  )
  // @ts-ignore
  const metaData = metaDataResponse.data
    ? metaDataResponse.data.metaData
    : undefined

  const ndexNetworkProperties = {
    uuid: uuid,
    summary: summary,
    metaData: metaData,
  }

  return (
    <CyNDExProvider port={1234}>
      {useQueryResult ? (
        subCx ? (
          <OpenInCytoscapeButton
            size="small"
            fetchCX={fetchCX}
            onSuccess={onSuccess}
            onFailure={onFailure}
          />
        ) : null
      ) : (
        <OpenInCytoscapeButton
          size="small"
          ndexNetworkProperties={ndexNetworkProperties}
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
      )}
      <Snackbar
        open={snackMessage !== undefined}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackMessage}
      />
    </CyNDExProvider>
  )
}

export default OpenInCytoscape
