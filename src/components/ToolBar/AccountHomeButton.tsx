import React, { FC, useContext } from 'react'
import { IconButton, Tooltip } from '@material-ui/core'
import AppContext from '../../context/AppState'
import ReturnIcon from '@material-ui/icons/FolderShared'

import { getCurrentServer } from '../../utils/locationUtil'

const AccountHomeButton: FC = () => {
  const { config } = useContext(AppContext)
  const baseUrl: string = getCurrentServer();

  const handleClick = (): void => {
    window.open(baseUrl, '_self')
  }

  return (
    <Tooltip title="My account home (in Classic Mode)" placement="bottom" arrow>
      <IconButton aria-label="Account Home" onClick={handleClick}>
        <ReturnIcon color="secondary" />
      </IconButton>
    </Tooltip>
  )
}

export default AccountHomeButton
