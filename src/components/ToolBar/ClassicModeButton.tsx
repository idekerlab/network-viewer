import React, { FC, useContext } from 'react'
import { Button, Tooltip } from '@material-ui/core'
import ReturnIcon from '@material-ui/icons/OpenInBrowser'
import AppContext from '../../context/AppState'
import { useParams } from 'react-router-dom'

const ClassicModeButton: FC = () => {
  const { config } = useContext(AppContext)
  const { uuid } = useParams()

  const baseUrl: string = config.ndexHttps
  const classicUrl = `${baseUrl}/#/network/${uuid}`

  const handleClick = (): void => {
    window.open(classicUrl, '_self')
  }

  return (
    <Tooltip title="View this network in the Classic Mode" placement="top" arrow>
      <Button variant="outlined" color="default" size="small" endIcon={<ReturnIcon />} onClick={handleClick}>
        Classic Mode
      </Button>
    </Tooltip>
  )
}

export default ClassicModeButton
