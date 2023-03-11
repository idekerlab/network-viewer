import { useState, useContext } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
} from '@material-ui/core'

import NdexLoginPanel from './NdexLoginPanel'
import { makeStyles } from '@material-ui/styles'

import NdexLogo from '../../../assets/images/ndex-logo.svg'

import { NdexAccountContext } from '../../../context/NdexAccountContext'

import NdexSignUpPanel from './NdexSignUpPanel'
import ForgotPasswordPanel from './ForgotPasswordPanel'

import TermsAndConditionsPanel from './TermsAndConditionsPanel'

const content_mode = {
  SIGN_IN: 'SIGN_IN',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  SIGN_TERMS_AND_CONDITIONS: 'SIGN_TERMS_AND_CONDITIONS',
  SIGN_UP: 'SIGN_UP',
}

const title_options = {
  SIGN_IN: 'Sign in to your NDEx Account',
  FORGOT_PASSWORD: 'Reset Password',
  SIGN_TERMS_AND_CONDITIONS: 'Create New Account',
  SIGN_UP: 'Sign Up for NDEx',
}

const useStyles = makeStyles({
  root: {
    padding: 0,
    margin: 0,
  },
  content: {
    padding: 0,
    margin: 0,
  },
  title: {
    color: '#444444',
    'padding-top': '0.8em',
    'padding-bottom': '0em',
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  ndexLogo: {
    height: '3em',
    marginRight: '1em',
  },
  actionPanel: {
    margin: 0,
    padding: '0.3em',
  },
  userIcon: {
    height: '1.5em',
    width: '1.5em',
  },
})

export const NdexLoginDialog = (props) => {
  const classes = useStyles()

  const {
    isOpen,
    setDialogState,
    ndexServer,
    onLoginSuccess,
    onLogout,
    handleNDExSignOn,
    onSuccessLogin,
    onGoogleSuccess,
    onError,
    handleError,
    errorMessage,
    signIn,
    googleSSO,
    onGoogleAgreement,
  } = props

  const { loginInfo } = useContext(NdexAccountContext)

  const [contentMode, setContentMode] = useState(content_mode.SIGN_IN)

  const getContent = () => {
    switch (contentMode) {
      case content_mode.SIGN_IN:
        return (
          <NdexLoginPanel
            setDialogState={setDialogState}
            onLoginSuccess={onLoginSuccess}
            onLogout={onLogout}
            handleNDExSignOn={handleNDExSignOn}
            onSuccessLogin={onSuccessLogin}
            onSuccess={onGoogleSuccess}
            onError={onError}
            handleError={handleError}
            error={errorMessage}
            ndexServer={ndexServer}
            googleSignIn={signIn}
            googleSSO={googleSSO}
            setContentMode={setContentMode}
          />
        )
      case content_mode.SIGN_UP:
        return (
          <NdexSignUpPanel
            ndexServer={ndexServer}
            handleNDExSignOn={handleNDExSignOn}
          />
        )
      case content_mode.FORGOT_PASSWORD:
        return <ForgotPasswordPanel />
      case content_mode.SIGN_TERMS_AND_CONDITIONS:
        return (
          <TermsAndConditionsPanel
            ndexServer={ndexServer}
            onGoogleAgreement={onGoogleAgreement}
          />
        )
      default:
        return <div />
    }
  }

  const title = title_options[contentMode]

  return (
    <Dialog className={classes.root} open={isOpen}>
      {loginInfo !== null ? (
        <div />
      ) : (
        <DialogTitle disableTypography={true} className={classes.title}>
          <div className={classes.titleWrapper}>
            <img
              src={NdexLogo}
              alt={'NDEx Logo'}
              className={classes.ndexLogo}
            />
            <div>
              <Typography variant={'subtitle1'}>{title}</Typography>
            </div>
          </div>
        </DialogTitle>
      )}
      <DialogContent className={classes.content}>{getContent()}</DialogContent>
      <Divider />
      <DialogActions className={classes.actionPanel}>
        {contentMode !== content_mode.SIGN_IN && (
          <Button
            variant={'outlined'}
            onClick={() => {
              setContentMode(content_mode.SIGN_IN)
            }}
          >
            Back
          </Button>
        )}
        <Button
          variant={'contained'}
          onClick={() => {
            setDialogState(false)
            setContentMode(content_mode.SIGN_IN)
          }}
          color={'default'}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
