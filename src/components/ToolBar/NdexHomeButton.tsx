import React, { FC, useContext } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { IconButton, Tooltip } from '@material-ui/core'
import AppContext from '../../context/AppState'
import logo from '../../assets/images/ndex-logo.svg'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ndexLogo: {
      height: '1.2em',
    },
  }),
)

const NdexHomeButton: FC = () => {
  const classes = useStyles()
  const { config } = useContext(AppContext)
  const baseUrl: string = config.ndexHttps

  const handleClick = (): void => {
    window.open(baseUrl, '_self')
  }

  return (
    <Tooltip title="NDEx home" placement="bottom">
      <IconButton aria-label="NDEx Home" onClick={handleClick} className={classes.ndexLogo}>
        <img alt="NDEx Logo" src={logo} className={classes.ndexLogo} />
      </IconButton>
    </Tooltip>
  )
}

export default NdexHomeButton
