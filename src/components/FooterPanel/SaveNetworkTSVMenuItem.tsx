import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import useCx from '../../hooks/useCx'
import AppContext from '../../context/AppState'
import ExportTsvMenuItem from '../ExportTsvMenuItem'

const SaveNetworkTSVMenuItem = () => {

  const { uuid } = useParams();

  const { ndexCredential } = useContext(AppContext);

  const { status, data, error, isFetching } = useCx(uuid, 'http://dev.ndexbio.org', 'v2', ndexCredential);

  
    return (<ExportTsvMenuItem cx={ status && status == 'success' ? data : null} /> )
  
  }
  
  export default SaveNetworkTSVMenuItem