import React, { useState, useContext } from 'react'
import { useParams } from 'react-router-dom'

import useCx from '../../hooks/useCx'
import AppContext from '../../context/AppState'

import IconButton from '@material-ui/core/IconButton'
import DownloadIcon from '@material-ui/icons/CloudDownload'

const SaveNetworkCXButton = () => {
  const { uuid } = useParams()

  const { ndexCredential, config, summary } = useContext(AppContext)

  const exportCx = () => {
    const a = document.createElement('a')
    // const file = new Blob([content], { type: contentType })
    let credentialProp = ''
    if (ndexCredential.isLogin) {
      if (ndexCredential.isGoogle) {
        credentialProp = "&id_token=" + ndexCredential.oauth['loginDetails'].tokenId;
      } else {
        credentialProp = "&auth_token=" + btoa(ndexCredential.basic.userId + ':' + ndexCredential.basic.password);
      }
    }

    a.href = `${config.ndexHttps}/v2/network/${uuid}?download=true${credentialProp}`
    a.click()
  }

  const handleClick = () => {
    exportCx()
  }

  return <IconButton disabled={!summary} onClick={handleClick}>
    <DownloadIcon />
  </IconButton>
}

export default SaveNetworkCXButton
