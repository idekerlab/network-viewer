import React, { useState, useContext } from 'react'
import { useParams } from 'react-router-dom'

import useCx from '../../hooks/useCx'
import AppContext from '../../context/AppState'

import ExportCxButton from '../ExportCxButton'

const SaveNetworkCXButton = () => {
  const { uuid } = useParams()

  const { ndexCredential, config } = useContext(AppContext)

  const { status, data, error, isFetching } = useCx(
    uuid,
    config.ndexHttps,
    'v2',
    ndexCredential,
    undefined,
    undefined,
    '2',
  )

  return <ExportCxButton cx={status && status == 'success' ? data : null} />
}

export default SaveNetworkCXButton
