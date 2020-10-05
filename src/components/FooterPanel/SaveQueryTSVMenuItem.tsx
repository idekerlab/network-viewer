import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import useSearch from '../../hooks/useSearch'
import AppContext from '../../context/AppState'
import ExportTsvMenuItem from '../ExportTsvMenuItem'

const SaveQueryTSVMenuItem = () => {

  const { uuid } = useParams();

  const { query, queryMode, uiState, ndexCredential, config } = useContext(AppContext)

  const { status, data, error, isFetching } = useSearch(uuid, query, config.ndexHttps, ndexCredential, queryMode)

  const subCx = data !== undefined ? data['cx'] : undefined;
  
    return (<ExportTsvMenuItem cx={ status && status == 'success' ? subCx : null} /> )
  
  }
  
  export default SaveQueryTSVMenuItem