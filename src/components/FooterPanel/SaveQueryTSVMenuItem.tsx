import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import useSearch from '../../hooks/useSearch'
import AppContext from '../../context/AppState'
import ExportTsvMenuItem from '../ExportTsvMenuItem'

const SaveQueryTSVMenuItem = () => {
  const { uuid } = useParams()

  const { query, queryMode, ndexCredential, config, summary } = useContext(
    AppContext,
  )

  const { status, data } = useSearch(
    uuid,
    query,
    config.ndexHttps,
    ndexCredential,
    queryMode,
    config.maxEdgeQuery,
  )

  const edgeLimitExceeded: boolean =
    data !== undefined ? data['edgeLimitExceeded'] : false
  const summaryObjectCount = summary
    ? summary.subnetworkNodeCount + summary.subnetworkEdgeCount
    : 0

  const subCx = data !== undefined ? data['cx'] : undefined

  const fileName = uuid ? uuid + ' subnet.tsv' : 'subnet.tsv'

  return (
    <ExportTsvMenuItem
      cx={
        status &&
        status === 'success' &&
        !edgeLimitExceeded &&
        summaryObjectCount > 0
          ? subCx
          : undefined
      }
      fileName={fileName}
    />
  )
}

export default SaveQueryTSVMenuItem
