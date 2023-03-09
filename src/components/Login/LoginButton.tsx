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
  const [enabled, setEnabled] = useState<boolean>(false)

  const [name, setName] = useState<string>('')

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
        backgroundColor: enabled ? deepOrange[400] : deepOrange[50],
      },
    }),
  )
  const classes = useStyles()

  useEffect(() => {
    if (client === undefined) {
      return
    }
    console.log('LB ++++++++++++++++++ LoginButton Got keycloak', client)

    // TODO: why we need to wait???
    setTimeout(() => {
      const tokenObj = client.tokenParsed

      console.log('CheckName', tokenObj, client)
      if (tokenObj !== undefined) {
        console.log('LB NAME Available', client.tokenParsed.name)
        setName(client.tokenParsed.name)
      } else {
        console.log('LB NONAME', client)
        setName('?')
      }
      setEnabled(true)
    }, 1000)
  }, [client])

  const handleClose = (): void => {
    if (!enabled) {
      // Button is not ready yet
      return
    }
    console.log('LoginButton:handleClose token2', client)

    const authenticated: boolean = client.authenticated

    if (!open) {
      if (authenticated) {
        setOpen(true)
      } else if (!authenticated) {
        // Need to login
        client
          ?.login()
          .then((result) => {
            console.log('* Login success', result)
          })
          .catch((error: any) => {
            console.warn('Failed to login', error)
          })
      }
    } else {
      setOpen(false)
    }
  }
  const handleLogout = (): void => {
    if (client === undefined) {
      // Button is not ready yet
      return
    }
    // client.logout({
    //     redirectUri: window.location.origin,
    //   })
    client
      .logout()
      .then(() => {
        console.log('* Logout success')
        setName('')
      })
      .catch((error: any) => {
        console.warn('Failed to logout', error)
      })
  }

  const parsed: KeycloakTokenParsed = client?.tokenParsed ?? {}
  const tooltipTitle = name === '' ? 'Click to login' : name
  return (
    <>
      <Tooltip title={tooltipTitle}>
        <Avatar onClick={handleClose} className={classes.orange}>
          {name.length > 0 ? name[0] : null}
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
