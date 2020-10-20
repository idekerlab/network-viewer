import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import useCx from '../../hooks/useCx'
import AppContext from '../../context/AppState'
import ExportTsvMenuItem from '../ExportTsvMenuItem'

const SaveNetworkTSVMenuItem = () => {
  const { uuid } = useParams()

  const { ndexCredential, config, summary } = useContext(AppContext)

  const { status, data } = useCx(uuid, config.ndexHttps, 'v2', ndexCredential)

  const fileName = summary ? summary.name + '.tsv' : 'network.tsv'

  return <ExportTsvMenuItem cx={status && status == 'success' ? data : null} fileName={fileName}/>
}

export default SaveNetworkTSVMenuItem
