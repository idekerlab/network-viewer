import React, { FC, useContext } from 'react'
import { Button, Tooltip } from '@material-ui/core'
import ReturnIcon from '@material-ui/icons/OpenInBrowser'
import AppContext from '../../context/AppState'
import { useParams } from 'react-router-dom'

import { appendWindowProtocol } from '../../utils/locationUtil'

const ClassicModeButton: FC = () => {
  const { config } = useContext(AppContext)
  const { uuid } = useParams()

  const baseUrl: string = appendWindowProtocol(config.ndexUrl)
  const classicUrl = `${baseUrl}/#/network/${uuid}`

  const handleClick = (): void => {
    window.open(classicUrl, '_self')
  }

  return (
    <Tooltip title="View this network in Classic Mode">
      <Button variant="outlined" color="default" size="small" endIcon={<ReturnIcon />} onClick={handleClick}>
        Switch to Classic Mode
      </Button>
    </Tooltip>
  )
}

export default ClassicModeButton
