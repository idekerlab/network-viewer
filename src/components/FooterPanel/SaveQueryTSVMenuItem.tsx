import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import useSearch from '../../hooks/useSearch'
import AppContext from '../../context/AppState'
import ExportTsvMenuItem from '../ExportTsvMenuItem'

const SaveQueryTSVMenuItem = () => {
  const { uuid } = useParams()

  const { query, queryMode, ndexCredential, config, summary} = useContext(AppContext)

  const { status, data } = useSearch(uuid, query, config.ndexHttps, ndexCredential, queryMode)

  const subCx = data !== undefined ? data['cx'] : undefined

  const fileName = uuid ? uuid + ' subnet.tsv' : 'subnet.tsv'

  return <ExportTsvMenuItem cx={status && status == 'success' ? subCx : null} fileName={fileName}/>
}

export default SaveQueryTSVMenuItem
