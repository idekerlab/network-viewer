import React, { useState, useContext } from 'react'
import { useParams } from 'react-router-dom'

import useCx from '../../hooks/useCx'
import AppContext from '../../context/AppState'

import ExportCxButton from '../ExportCxButton'

const SaveNetworkCXButton = () => {
  const { uuid } = useParams()

  const { ndexCredential, config, summary } = useContext(AppContext)

  const { status, data } = useCx(uuid, config.ndexHttps, 'v2', ndexCredential, undefined, undefined, '1')

  const fileName = summary ? summary.name + '.cx' : 'network.cx'

  return <ExportCxButton cx={status && status == 'success' ? data : null} fileName={fileName} />
}

export default SaveNetworkCXButton
