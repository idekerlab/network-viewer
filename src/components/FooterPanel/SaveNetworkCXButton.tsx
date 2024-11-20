import { useContext } from 'react'
import { useParams } from 'react-router-dom'

import AppContext from '../../context/AppState'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DownloadIcon from '@material-ui/icons/CloudDownload'

import { appendWindowProtocol } from '../../utils/locationUtil'
import { AuthType } from '../../model/AuthType'

const SaveNetworkCXButton = () => {
  const { uuid } = useParams()

  const { ndexCredential, config, summary } = useContext(AppContext)
  const { accessKey, authenticated, idToken } = ndexCredential

  const exportCx = () => {
    const a = document.createElement('a')
    let credentialProp = ''
    if (idToken !== undefined && authenticated) {
      credentialProp += '&id_token=' + idToken
    }
    if (accessKey !== undefined) {
      credentialProp += '&accesskey=' + accessKey
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
