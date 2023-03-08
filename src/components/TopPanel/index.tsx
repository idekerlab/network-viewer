import React, { useContext } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import logo from '../../assets/images/ndex-logo.svg'

import { getCurrentServer } from '../../utils/locationUtil'
import KeycloakContext from '../../context/KeycloakContext'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'grid',
      width: '100%',
      height: '100%',
      placeItems: 'center',
    },
    item: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    message: {
      padding: '1em',
    },
    ndexLogo: {
      height: '20vh',
      padding: '1em',
      '&:hover': {
        cursor: 'pointer',
        color: theme.palette.secondary.main,
      },
    },
    link: {
      '&:hover': {
        fontWeight: 700,
        cursor: 'pointer',
        color: theme.palette.secondary.main,
      },
    },
  }),
)

const TopPage = ({ config }) => {
  const classes = useStyles()

  const { client } = useContext(KeycloakContext)

  const url = getCurrentServer()

  const handleClick = () => {
    // window.open(url, '_self')

    if (client.authenticated) {
      console.log(
        'AUTHED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!TopPage client=',
        client.token,
      )
      client.logout().then((result) => {
        console.log('* Logout success', result)
      })
    } else {
      client.login().then((result) => {
        console.log('* Login success', result)
      })
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.item}>
        <img
          alt="NDEx Logo"
          src={logo}
          className={classes.ndexLogo}
          onClick={handleClick}
        />
        <Typography className={classes.message} variant="h4">
          Please specify UUID of the network
        </Typography>

        <Typography
          className={classes.link}
          onClick={handleClick}
          variant="body1"
        >
          Back to NDEx Home
        </Typography>
      </div>
    </div>
  )
}

export default TopPage
