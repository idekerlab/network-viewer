import React, { useState } from 'react'


import SaveNetworkCXButton from './SaveNetworkCXButton'
import DownloadIcon from '@material-ui/icons/CloudDownload'
import { IconButton } from '@material-ui/core'

const SaveNetworkButton = () => {

  const [save, setSave] = useState(false);

  const handleClick = () => {
    setSave(true);
  }

    return (  save ?  <SaveNetworkCXButton /> 
      : <IconButton onClick={handleClick}>
        <DownloadIcon />
      </IconButton>
    )
  
}

export default SaveNetworkButton
