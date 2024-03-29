import React, { FC } from 'react'
import { Button, Tooltip } from '@material-ui/core'
import ReturnIcon from '@material-ui/icons/OpenInBrowser'
import { useParams } from 'react-router-dom'

import { getCurrentServer } from '../../utils/locationUtil'

const ClassicModeButton: FC = () => {
  const { uuid } = useParams()

  const baseUrl: string = getCurrentServer();
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
