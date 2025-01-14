import { useState, useContext, useEffect, ReactElement } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Avatar from '@material-ui/core/Avatar'
import { useStyles } from './buttonStyle'
import AppContext from '../../../context/AppState'
import { NdexUserInfoPopover } from '../NdexUserInfoPopover'
import NdexCredential from '../../../model/NdexCredential'
import { Visibility } from '../../../model/Visibility'
import { getCurrentServer } from '../../../utils/locationUtil'

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
  const { config, keycloak, ndexCredential, setNdexCredential, summary } =
    useContext(AppContext)

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

  const onLogout = (): void => {
    // Clear credential from global state
    setNdexCredential({
      authenticated: false,
    })
    const { visibility } = summary

    if (visibility === Visibility.PUBLIC) {
      keycloak.logout()
    } else {
      // if it is private network, then redirect to NDEx
      const baseUrl: string = getCurrentServer()
      keycloak.logout({ redirectUri: baseUrl })
    }
  }

  const getTitle = (): string => {
    return ndexCredential.authenticated
      ? 'Signed in as ' + ndexCredential.userName
      : 'Sign in to NDEx'
  }

  const handleClick = (event): void => {
    if (ndexCredential.authenticated) {
      setAnchorEl(event.currentTarget)
    } else {
      keycloak.login().then(() => {
        if (keycloak.authenticated) {
          setNdexCredential({
            authenticated: true,
            userName: keycloak.tokenParsed.preferred_username,
            idToken: keycloak.token,
            fullName: keycloak.tokenParsed.name,
          } as NdexCredential)
          console.log('Login successfully')
        } else {
          // Failed
          setNdexCredential({
            authenticated: false,
          } as NdexCredential)
          console.log('Not authenticated')
        }
      })
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
            {ndexCredential.authenticated === false
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
