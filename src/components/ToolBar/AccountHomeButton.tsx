import React, { FC, useContext } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { IconButton, Tooltip } from '@material-ui/core'
import AppContext from '../../context/AppState'
import ReturnIcon from '@material-ui/icons/FolderShared'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ndexLogo: {
      height: '1em',
    },
    menuButton: {
      marginRight: 0,
    },
    menuButtonHidden: {
      display: 'none',
    },
  }),
)

const AccountHomeButton: FC = () => {
  const classes = useStyles()
  const { config } = useContext(AppContext)
  const baseUrl: string = config.ndexHttps

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
