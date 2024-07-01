import { useState, useContext, useEffect, ReactElement } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Avatar from '@material-ui/core/Avatar'
import { useStyles } from './buttonStyle'
import AppContext from '../../../context/AppState'
import { NdexUserInfoPopover } from '../NdexUserInfoPopover'
import { AuthType } from '../../../model/AuthType'
import { NdexCredentialTag } from '../NdexCredentialTag'
import NdexCredential from '../../../model/NdexCredential'

/**
 * Simplified version of NDEx login button
 *  - Supports both Google and NDEx basic auth
 *
 * @returns
 */
export const NdexSignInButton = () => {
  const classes = useStyles()

  const [disabled, setDisabled] = useState<boolean>(true)

  // New Keycloak client
  const {
    config,
    keycloak,
    ndexCredential,
    setNdexCredential,
    showLogin,
    setShowLogin,
    summary,
  } = useContext(AppContext)

  useEffect(() => {
    if (ndexCredential === undefined || keycloak === undefined) {
      return
    }
    console.log('Initializing login button state', ndexCredential)
    setDisabled(false)
  }, [ndexCredential, keycloak])

  // Open/close login dialog
  // const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<ReactElement | null>(null)
  const isPopoverOpen: boolean = Boolean(anchorEl)

  const handleClose = (): void => {
    setAnchorEl(null)
  }

  const [errorMessage, setErrorMessage] = useState<string>('')

  const onLoginSuccess = (event): void => {
    console.log('Login success', event)
  }

  const postLogout = (): void => {
    console.log('Post logout cleanup')
    const { visibility } = summary

    setShowLogin(false)
    if (visibility === 'PRIVATE') {
      setTimeout(() => {
        window.location.reload()
      }, 500)
    }
  }
  const onLogout = (): void => {
    const { authType } = ndexCredential

    // Clear credential from global state
    setNdexCredential({
      authType: AuthType.NONE,
    })

    if (authType === AuthType.BASIC) {
      window.localStorage.removeItem(NdexCredentialTag.NdexCredential)
      postLogout()
    } else if (authType === AuthType.KEYCLOAK) {
      keycloak.logout()
    }
  }

  const getTitle = (): string => {
    return ndexCredential.authType !== AuthType.NONE
      ? 'Signed in as ' + ndexCredential.userName
      : 'Sign in to NDEx'
  }

  const handleLogin = () => {
    setShowLogin(false)

    keycloak.login().then(() => {
      if (keycloak.authenticated) {
        setNdexCredential({
          authType: AuthType.KEYCLOAK,
          userName: keycloak.tokenParsed.preferred_username,
          accesskey: keycloak.token,
          fullName: keycloak.tokenParsed.name,
        } as NdexCredential)
        console.log('* Authenticated via keycloak')
      } else {
        // Failed
        setNdexCredential({
          authType: AuthType.NONE,
        } as NdexCredential)
        console.log('Not authenticated')
        setErrorMessage('Unable to authenticate')
      }
    })
  }

  const handleClick = (event): void => {
    if (ndexCredential.authType !== AuthType.NONE) {
      setAnchorEl(event.currentTarget)
    } else {
      handleLogin()
    }
  }

  return (
    <>
      <Tooltip disableFocusListener title={getTitle()} placement="bottom">
        <IconButton
          className={classes.iconButton}
          onClick={handleClick}
          disabled={disabled}
        >
          <Avatar className={classes.iconMedium}>
            {ndexCredential.authType === AuthType.NONE
              ? null
              : ndexCredential.fullName[0]}
          </Avatar>
        </IconButton>
      </Tooltip>
      <NdexUserInfoPopover
        userName={ndexCredential.fullName}
        userId={ndexCredential.userName}
        isOpen={isPopoverOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        onLogout={onLogout}
        myAccountUrl={config.ndexUrl + '/index.html#/myAccount'}
      />
    </>
  )
}
