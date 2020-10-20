import React, { useState, useContext } from 'react'
import { useParams } from 'react-router-dom'

import useCx from '../../hooks/useCx'
import AppContext from '../../context/AppState'

import ExportCxButton from '../ExportCxButton'

const SaveNetworkCXButton = () => {
  const { uuid } = useParams()

  const { ndexCredential, config, summary } = useContext(AppContext)

  const objectCount = summary ? summary['edgeCount'] + summary['nodeCount'] : null;

  const { status, data } = useCx(uuid, config.ndexHttps, 'v2', ndexCredential, config.maxNumObjects, objectCount, '1')

  const fileName = summary ? summary.name + '.cx' : 'network.cx'

  return <ExportCxButton cx={status && status == 'success' ? data : null} fileName={fileName} />
}

export default SaveNetworkCXButton
