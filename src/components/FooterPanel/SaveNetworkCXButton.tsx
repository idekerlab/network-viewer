import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'

import AppContext from '../../context/AppState'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DownloadIcon from '@material-ui/icons/CloudDownload'

import { appendWindowProtocol } from '../../utils/locationUtil'

const SaveNetworkCXButton = () => {
  const { uuid } = useParams()

  const { ndexCredential, config, summary } = useContext(AppContext)

  const exportCx = () => {
    const a = document.createElement('a')
    let credentialProp = ''
    if (ndexCredential.isLogin) {
      if (ndexCredential.isGoogle) {
        credentialProp =
          '&id_token=' + ndexCredential.oauth['loginDetails'].tokenId
      } else {
        credentialProp =
          '&auth_token=' +
          btoa(
            ndexCredential.basic.userId + ':' + ndexCredential.basic.password,
          )
      }
    }

    a.href = `${appendWindowProtocol(
      config.ndexUrl,
    )}/v2/network/${uuid}?download=true${credentialProp}`
    a.click()
  }

  const handleClick = () => {
    exportCx()
  }

  return (
    <Tooltip title="Download this network in CX format">
      <IconButton disabled={!summary} onClick={handleClick} color="inherit">
        <DownloadIcon />
      </IconButton>
    </Tooltip>
  )
}

export default SaveNetworkCXButton
