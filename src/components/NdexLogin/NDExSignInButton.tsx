import React, { useState, useContext, useEffect } from 'react'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import NdexLoginDialog from './NdexLoginDialog'
import { NDExAccountContext } from '../../context/NDExAccountContext'
import Avatar from '@material-ui/core/Avatar'
import NdexUserInfoPopover from './NdexUserInfoPopover'

// import { useGoogleLogin, useGoogleLogout } from 'react-google-login'
import { UserValidation, validateLogin } from './validateCredentials'
import { handleNDExSignOn } from './handleNDExSignOn'
import { getUserByEmail } from '../../api/ndex'
import { blue } from '@material-ui/core/colors'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconButton: {
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    iconSmall: {
      color: '#FFFFFF',
      backgroundColor: blue[500],
      height: theme.spacing(3),
      width: theme.spacing(3),
    },
    iconMedium: {
      color: '#FFFFFF',
      backgroundColor: blue[500],
      height: theme.spacing(5),
      width: theme.spacing(5),
    },
    iconLarge: {
      color: '#FFFFFF',
      backgroundColor: blue[500],
      height: theme.spacing(7),
      width: theme.spacing(7),
    },
    logoutIconSmall: {
      color: blue[500],
      height: theme.spacing(3),
      width: theme.spacing(3),
    },
    logoutIconMedium: {
      color: blue[500],
      height: theme.spacing(5),
      width: theme.spacing(5),
    },
    logoutIconLarge: {
      color: blue[500],
      height: theme.spacing(7),
      width: theme.spacing(7),
    },
  }),
)

const DEFAULT_HANDLER = (loginState) => {
  // Default callback function for login status change
  console.warn('Default handler: NDEx login state updated', loginState)

  // Add actual handler here...
}

const LOGGED_IN_USER = 'loggedInUser'

const NDExSignInButton = (props) => {
  const classes = useStyles()

  const {
    ndexServerURL,
    loginInfo,
    setLoginInfo,
    googleClientId,
    userProfile,
    isUserProfileLoading,
    getUserProfile,
  } = useContext(NDExAccountContext)

  const { onLoginStateUpdated, myAccountURL } = props

  let onUpdate = DEFAULT_HANDLER
  if (onLoginStateUpdated !== null && onLoginStateUpdated !== undefined) {
    onUpdate = onLoginStateUpdated
  }

  useEffect(() => {
    // This is necessary because initialization code will not be executed without Google Client ID
    setTimeout(() => {
      if (googleClientId === undefined) {
        console.info(
          '* Google Login is disabled for this server. Basic Auth only.',
        )
        onAutoLoadFinished(null)
      }
    }, 800)
  }, [])

  const [isDialogOpen, setDialogOpen] = useState(false)

  const setDialogState = (dialogState) => {
    setDialogOpen(dialogState)
  }

  const [anchorEl, setAnchorEl] = useState<any>(null)

  const handleClose = () => {
    setAnchorEl(null)
  }

  const isPopoverOpen = Boolean(anchorEl)

  const { variant, size } = props

  const [errorMessage, setErrorMessage] = useState('')

  const onLoginSuccess = (event): void => {
    console.log('Login success', event)
  }

  const onGoogleLogoutSuccess = (): void => {
    console.log('Google logged out')
  }

  const onLogout = (): void => {
    if (googleSignOut !== null && loginInfo.isGoogle) {
      googleSignOut()
    } else {
      window.localStorage.removeItem(LOGGED_IN_USER)
    }
    setLoginInfo(null)
    onLoginStateUpdated(null)
    setDialogState(false)
  }

  /**
   * Will be executed after Google login is finished.
   */
  const onGoogleSuccess = (res) => {
    const newNdexCredential = {
      loaded: true,
      isLogin: true,
      isGoogle: true,
      oauth: res,
    }

    getUserByEmail(
      ndexServerURL,
      'v2',
      newNdexCredential.oauth.profileObj.email,
    )
      .then(() => {
        onGoogleAgreement(res)
      })
      .catch((error) => {
        // if (isOpen) {
        // setTempGoogleAuth(res)
        // setContentMode(content_mode.SIGN_TERMS_AND_CONDITIONS)
        // } else {
        setLoginInfo(null)
        getUserProfile(null)
        onLoginStateUpdated(null)
        console.warn('Get by email failed:', error)
        // }
      })
  }

  const onGoogleAgreement = (res) => {
    const newLoginInfo = { isGoogle: true, loginDetails: res }

    refreshTokenSetup(res)
    onSuccessLogin(newLoginInfo)
  }

  // Default timeout is 20% before the expiration of the token
  const FIVE_MINUTES = 5 * 60 * 1000
  const getRefreshTime = (expInMilSec: number): number => {
    return expInMilSec * 1000 - FIVE_MINUTES
  }

  // It is not necessary to refresh the token for the first time
  let isInitialized: boolean = false

  const refreshTokenSetup = (res): void => {
    let refreshTiming: number = getRefreshTime(res.expires_in)

    const refreshToken = async () => {
      const newAuthRes = await res.reloadAuthResponse()
      refreshTiming = getRefreshTime(newAuthRes.expires_in)

      if (isInitialized) {
        onTokenRefresh(res, newAuthRes)
      } else {
        isInitialized = true
      }
      setTimeout(refreshToken, refreshTiming)
    }

    // Initiate the call to refresh the token
    setTimeout(refreshToken, refreshTiming)
  }

  /**
   *
   * Refresh the token before it expires
   *
   * @param res original credential object
   * @param newRes new credential object
   */
  const onTokenRefresh = (res, newRes): void => {
    const loginDetails = res
    let refreshedLoginDetails = Object.assign({}, loginDetails)
    const { id_token } = newRes

    refreshedLoginDetails['tokenId'] = id_token
    const loginInfo = { isGoogle: true, loginDetails: refreshedLoginDetails }
    setLoginInfo(loginInfo)
    onLoginStateUpdated(loginInfo)
  }

  const onSuccessLogin = (loginInfo) => {
    setLoginInfo(loginInfo)
    if (loginInfo.isGoogle) {
      getUserProfile(loginInfo.loginDetails.profileObj.email)
    } else {
      getUserProfile(loginInfo.loginDetails.details.emailAddress)
    }
    onLoginStateUpdated(loginInfo)
    setDialogState(false)
  }

  const handleError = (error) => {
    console.log('Error:', error)
    setErrorMessage(error)
  }

  const onError = (error: any) => {
    props.handleError(error)
    // setIsGoogle({ googleSSO })
  }

  // Unique ID for each NDEx server
  let googleSSO = true
  if (googleClientId === undefined || googleClientId === null) {
    googleSSO = false
  }

  const onFailure = (err): void => {
    const message =
      (err.details &&
        err.details.startsWith(
          'Not a valid origin for the client: http://localhost:',
        )) ||
      (err.error && err['error']) ||
      JSON.stringify(err)
    props.onError(message, false)
  }

  const onAutoLoadFinished = (signedIn): void => {
    const loggedInUserString = window.localStorage.getItem('loggedInUser')

    if (loggedInUserString) {
      const loggedInUser = JSON.parse(loggedInUserString)

      validateLogin(
        loggedInUser.userName,
        loggedInUser.token,
        ndexServerURL,
      ).then((data: UserValidation) => {
        if (data.error !== null) {
          setErrorMessage(data.error.message)
          setLoginInfo(null)
          onLoginStateUpdated(null)
        } else {
          handleNDExSignOn(
            {
              id: loggedInUser.userName,
              password: loggedInUser.token,
              ndexServerURL,
              fullName: data.userData.firstName + ' ' + data.userData.lastName,
              image: data.userData.image,
              details: data.userData,
            },
            onSuccessLogin,
          )
        }
      })
    } else {
      // Check current login status
      if (!signedIn) {
        setLoginInfo(null)
        onLoginStateUpdated(null)
      }
    }
  }

  let googleSignIn: (() => void) | null = null

  try {
    if (googleClientId !== undefined) {
      // const { signIn } = useGoogleLogin({
      //   clientId: googleClientId,
      //   scope: 'profile email',
      //   onSuccess: onGoogleSuccess,
      //   onFailure,
      //   onAutoLoadFinished,
      //   isSignedIn: true,
      //   fetchBasicProfile: true,
      // })
      // googleSignIn = signIn
    }
  } catch (error) {
    console.error('Google Login Initialization:', error)
  }

  let googleSignOut: (() => void) | null = null
  try {
    if (googleClientId !== undefined) {
      // const { signOut } = useGoogleLogout({
      //   clientId: googleClientId,
      //   onLogoutSuccess: onGoogleLogoutSuccess,
      //   // @ts-ignore
      //   onFailure: onFailure,
      // })
      // googleSignOut = signOut
    }
  } catch (error) {
    console.error('Google Logout Initialization failed:', error)
  }

  const iconClassName = (size: string) => {
    switch (size) {
      case 'small':
        return classes.iconSmall
      case 'large':
        return classes.iconLarge
      default:
        return classes.iconMedium
    }
  }

  const getLogoutIconClass = (size: string) => {
    switch (size) {
      case 'small':
        return classes.logoutIconSmall
      case 'large':
        return classes.logoutIconLarge
      default:
        return classes.logoutIconMedium
    }
  }

  const getIcon = () => {
    return loginInfo && userProfile && !isUserProfileLoading ? (
      <Avatar className={iconClassName(size)} src={userProfile.image}>
        {userProfile.image ? '' : userProfile.userName.trim().substring(0, 1)}
      </Avatar>
    ) : (
      <AccountCircleIcon className={getLogoutIconClass(size)} />
    )
  }

  const getTitle = () => {
    return loginInfo && userProfile && !isUserProfileLoading
      ? 'Signed in as ' + userProfile.userName
      : 'Sign in to NDEx'
  }

  const userId =
    loginInfo && userProfile && !isUserProfileLoading
      ? userProfile.userName
      : '(Not logged in)'

  const userName =
    loginInfo && userProfile && !isUserProfileLoading
      ? userProfile.firstName + ' ' + userProfile.lastName
      : ''
  const userImage =
    loginInfo && userProfile && !isUserProfileLoading
      ? userProfile.image
      : undefined

  return (
    <>
      <Tooltip disableFocusListener title={getTitle()} placement="bottom">
        <IconButton
          className={classes.iconButton}
          // variant={variant}
          onClick={(event) => {
            if (loginInfo) {
              setAnchorEl(event.currentTarget)
            } else {
              setDialogState(true)
            }
          }}
          size={size}
        >
          {getIcon()}
        </IconButton>
      </Tooltip>
      <NdexLoginDialog
        setDialogState={setDialogState}
        isOpen={isDialogOpen}
        ndexServer={ndexServerURL}
        onLoginStateUpdated={onUpdate}
        myAccountURL={myAccountURL}
        onLoginSuccess={onLoginSuccess}
        onLogout={onLogout}
        handleNDExSignOn={handleNDExSignOn}
        onSuccessLogin={onSuccessLogin}
        onGoogleSuccess={onGoogleSuccess}
        onError={onError}
        handleError={handleError}
        errorMessage={errorMessage}
        // signIn={googleSignIn}
        // googleSSO={googleSSO}
        onGoogleAgreement={onGoogleAgreement}
      />
      <NdexUserInfoPopover
        userName={userName}
        userId={userId}
        userImage={userImage}
        isOpen={isPopoverOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        myAccountURL={myAccountURL}
        onLogout={onLogout}
      />
    </>
  )
}

export default NDExSignInButton
