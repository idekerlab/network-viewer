import { Avatar, Tooltip } from '@material-ui/core'
// import { deepOrange } from '@material-ui/core/colors'
import { KeycloakTokenParsed } from 'keycloak-js'
import { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { LoginPanel } from './LoginPanel'

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { deepOrange } from '@material-ui/core/colors'
import AppContext from '../../context/AppState'

let initialized = false
export const LoginButton = (): ReactElement => {
  const { config, keycloak, isReady } = useContext(AppContext)
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
    console.log(
      'IS READY INIT -------------------------------',
      isReady,
      keycloak,
    )
    setEnabled(true)
    const isAuth: boolean = keycloak.authenticated
    setEnabled(true)
    console.log('Auth--------------Login', keycloak)

    if (isAuth && keycloak.tokenParsed !== undefined) {
      console.log('SET---------Auth--------------Login', keycloak)
      const tokenObj: KeycloakTokenParsed = keycloak.tokenParsed
      setName(tokenObj.name)
      keycloak
        .loadUserProfile()
        .then(function (profile) {
          console.log('Got P+++++++++++++++++', profile)
        })
        .catch(function () {
          alert('Failed to load user profile')
        })
    } else {
      console.log(')))))))))))) Auto NO user info yet. Login', keycloak)

      const keycloakInit = localStorage.getItem('keycloakInit')
      // if (keycloakInit === 'false') {
      //   localStorage.setItem('keycloakInit', 'true')
      //   keycloak.login({
      //     prompt: 'none',
      //   })
      // }
    }
  }, [isReady])

  useEffect(() => {
    console.log('* LoginButton got keycloak', keycloak)
    if (keycloak === undefined) {
      return
    }

    // const isAuth: boolean = keycloak.authenticated
    // setEnabled(true)
    // console.log('Auth--------------Login', keycloak)

    // if (isAuth && keycloak.tokenParsed !== undefined) {
    //   console.log('SET---------Auth--------------Login', keycloak)
    //   const tokenObj: KeycloakTokenParsed = keycloak.tokenParsed
    //   setName(tokenObj.name)
    //   keycloak
    //     .loadUserProfile()
    //     .then(function (profile) {
    //       console.log('Got P+++++++++++++++++', profile)
    //     })
    //     .catch(function () {
    //       alert('Failed to load user profile')
    //     })
    // } else {
    //   console.log(')))))))))))) Auto NO user info yet. Login', keycloak)

    //   const keycloakInit = localStorage.getItem('keycloakInit')
    //   // if (keycloakInit === 'false') {
    //   //   localStorage.setItem('keycloakInit', 'true')
    //   //   keycloak.login({
    //   //     prompt: 'none',
    //   //   })
    //   // }
    // }
  }, [keycloak])

  const handleClose = (): void => {
    if (!enabled) {
      // Button is not ready yet
      return
    }
    console.log('LoginButton: pressed')

    const authenticated: boolean = keycloak?.authenticated ?? false

    if (!open) {
      if (authenticated) {
        setOpen(true)
      } else if (!authenticated) {
        // Need to login
        keycloak
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
    const client = keycloak
    if (client === undefined) {
      // Button is not ready yet
      return
    }
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

  const parsed: KeycloakTokenParsed = keycloak?.tokenParsed ?? {}
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
