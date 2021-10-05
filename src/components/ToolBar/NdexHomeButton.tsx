import React, { FC } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { IconButton, Tooltip } from '@material-ui/core'
import logo from '../../assets/images/ndex-logo.svg'
import { getCurrentServer } from '../../utils/locationUtil'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ndexLogo: {
      height: theme.spacing(4.5),
      marginRight: theme.spacing(1),
      padding: 0,
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  }),
)

const NdexHomeButton: FC = () => {
  const classes = useStyles()
  const baseUrl: string = getCurrentServer()

  const handleClick = (): void => {
    window.open(baseUrl, '_self')
  }

  return (
    <Tooltip title="NDEx home" placement="bottom">
      <IconButton
        aria-label="NDEx Home"
        onClick={handleClick}
        className={classes.ndexLogo}
      >
        <img alt="NDEx Logo" src={logo} className={classes.ndexLogo} />
      </IconButton>
    </Tooltip>
  )
}

export default NdexHomeButton
