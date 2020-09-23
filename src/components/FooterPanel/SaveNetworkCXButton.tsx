import React, { useState, useContext } from 'react'
import { useParams } from 'react-router-dom'

import useCx from '../../hooks/useCx'
import AppContext from '../../context/AppState'

import ExportCxButton from '../ExportCxButton'
import IconButton from '@material-ui/core/IconButton'
import CircularProgress from '@material-ui/core/CircularProgress'

const SaveNetworkCXButton = () => {
  const { uuid } = useParams();

  const { ndexCredential } = useContext(AppContext);

  const { status, data, error, isFetching } = useCx(uuid, 'http://dev.ndexbio.org', 'v2', ndexCredential, undefined,undefined, '2');

  return (
    <ExportCxButton cx={ status && status == 'success' ? data : null } />
  )
}

export default SaveNetworkCXButton
