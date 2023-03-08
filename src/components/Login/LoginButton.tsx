import { Avatar, Tooltip } from '@material-ui/core'
// import { deepOrange } from '@material-ui/core/colors'
import { KeycloakTokenParsed } from 'keycloak-js'
import { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { LoginPanel } from './LoginPanel'

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { deepOrange } from '@material-ui/core/colors'
import KeycloakContext from '../../context/KeycloakContext'

export const LoginButton = (): ReactElement => {
  const { client } = useContext(KeycloakContext)
  const [open, setOpen] = useState<boolean>(false)

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        display: 'flex',
        '& > *': {
          margin: theme.spacing(1),
        },
      },
      orange: {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[400],
      },
    }),
  )
  const classes = useStyles()

  useEffect(() => {
    if (client === undefined) {
      return
    }
    console.log('++++++++++++++++++ LoginButton:useEffect4', client)
  }, [client])

  const handleClose = (): void => {
    // if (!enabled) {
    //   // Button is not ready yet
    //   return
    // }
    console.log('LoginButton:handleClose token2', client)

    return
    // const authenticated: boolean = keycloak.authenticated ?? false

    // if (!open) {
    //   if (authenticated) {
    //     setOpen(true)
    //   } else if (!authenticated) {
    //     // Need to login
    //     keycloak
    //       ?.login()
    //       .then((result) => {
    //         console.log('* Login success', result)
    //       })
    //       .catch((error: any) => {
    //         console.warn('Failed to login', error)
    //       })
    //   }
    // } else {
    //   setOpen(false)
    // }
  }
  const handleLogout = (): void => {
    // if (client === undefined) {
    //   // Button is not ready yet
    //   return
    // }
    // client
    //   ?.logout({
    //     redirectUri: window.location.origin,
    //   })
    //   .then(() => {
    //     console.log('* Logout success')
    //   })
    //   .catch((error: any) => {
    //     console.warn('Failed to logout', error)
    //   })
  }

  const parsed: KeycloakTokenParsed = client?.tokenParsed ?? {}
  console.log('LoginButton:parsed$$$$$$$$$$$$$', parsed)
  const tooltipTitle =
    parsed.name === undefined ? 'Click to login' : parsed.name
  return (
    <>
      <Tooltip title={tooltipTitle}>
        <Avatar onClick={handleClose} className={classes.orange}>
          {parsed.name === undefined ? null : parsed.name[0]}
        </Avatar>
      </Tooltip>
      <LoginPanel
        open={open}
        handleClose={handleClose}
        token={parsed}
        handleLogout={handleLogout}
      />
    </>
  )
}
