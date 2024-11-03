import React, { useState, FC, useEffect, useContext } from 'react'
import MessageDialog from './MessageDialog'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import NdexCredential from '../../model/NdexCredential'

// import WarningIcon from '@material-ui/icons/WarningOutlined'
// import LockIcon from '@material-ui/icons/LockOutlined'

import { getCurrentServer } from '../../utils/locationUtil'

import AppContext from '../../context/AppState'
import ResponseCode from '../../utils/error/ResponseCode'
import ErrorIcon from '../ErrorIcon'

/**
 *
 * An empty placeholder panel to check network size
 */

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    initPanel: {
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      color: '#AAAAAA',
      display: 'grid',
      placeItems: 'center',
    },
    message: {
      display: 'grid',
      placeItems: 'center',
      maxWidth: '40em',
    },
    errorMessage: {
      paddingTop: '1em',
      color: theme.palette.text.primary,
    },
    errorIcon: {
      fontSize: '15em',
    },
    progressIcon: {
      marginTop: '5em',
    },
    bottomMessage: {
      display: 'grid',
      placeItems: 'center',
      marginTop: theme.spacing(4),
    },
    caption: {
      marginTop: theme.spacing(1),
    },
    subMessage: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
      color: theme.palette.text.primary,
    },
    link: {
      color: theme.palette.info.main,
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
      '&:hover': {
        fontWeight: 600,
        cursor: 'pointer',
      },
    },
  }),
)

type InitPanelProps = {
  message: string
  subMessage?: string
  optionalMessage?: string
  code?: ResponseCode
  setProceed: Function
  setNoView?: Function
  showProgress?: boolean
  summary?: object
  error?: boolean
  // isDataTooLarge: boolean
  // setIsDataTooLarge: Function
}

const InitPanel: FC<InitPanelProps> = ({
  message,
  subMessage,
  optionalMessage,
  code,
  showProgress = false,
  summary,
  setProceed,
  error = false,
  setNoView,
}) => {
  const classes = useStyles()
  const { config, uiState, keycloak, setNdexCredential } =
    useContext(AppContext)

  const [open, setOpen] = useState(false)

  const [dialogTitle, setDialogTitle] = useState('')
  const [dialogMessage, setDialogMessage] = useState('')

  useEffect(() => {
    if (summary === undefined) {
      return
    }

    const total = summary['nodeCount'] + summary['edgeCount']
    const cxDataSize = summary['cx2FileSize']

    // Check data size.  If too big, proceed without view
    if (cxDataSize > config.maxDataSize || total > config.maxNumObjects) {
      setOpen(false)
      setProceed(true)
      return
    }

    if (total <= config.warningThreshold) {
      const hasLayout = summary['hasLayout']

      if (
        !hasLayout &&
        total > config.viewerThreshold &&
        uiState.maximizeResultView === false
      ) {
        setDialogTitle(`No layout available for this network`)
        setDialogMessage(
          'Do you want to visualize the network with random layout? Or click cancel to explore it without view',
        )
        setOpen(true)
      } else {
        // Small network.  Just load it.
        setProceed(true)
      }
    } else {
      // Network is huge.  Simply pass the empty CX and show warning panel
      setOpen(false)
      setProceed(true)
    }
  }, [summary])

  const handleClose = () => {
    // setIsDataTooLarge(false)
    setOpen(false)
  }

  const _handleLoginOpen = () => {
    keycloak.login().then(() => {
      if (keycloak.authenticated) {
        setNdexCredential({
          authenticated: true,
          userName: keycloak.tokenParsed.preferred_username,
          accesskey: keycloak.token,
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

  if (error) {
    return (
      <div className={classes.initPanel}>
        <div className={classes.message}>
          <ErrorIcon code={code} size={'12em'} />
          <Typography className={classes.errorMessage} variant="h4">
            {message}
          </Typography>
          <Typography variant="h5" className={classes.subMessage}>
            {optionalMessage}
          </Typography>

          {code === ResponseCode.Unauthorized ||
          code === ResponseCode.Forbidden ? (
            <Typography
              variant="h5"
              onClick={_handleLoginOpen}
              className={classes.link}
            >
              Sign In
            </Typography>
          ) : (
            <div />
          )}

          <Typography variant="body1">({subMessage})</Typography>
          <div className={classes.bottomMessage}>
            <Typography
              variant="caption"
              onClick={() => handleClick(`${getCurrentServer()}`)}
              className={classes.link}
            >
              Return to top page
            </Typography>
          </div>
        </div>
      </div>
    )
  }
  return (
    <React.Fragment>
      <MessageDialog
        setProceed={setProceed}
        setNoView={setNoView}
        open={open}
        setOpen={handleClose}
        title={dialogTitle}
        message={dialogMessage}
      />
      <div className={classes.initPanel}>
        <div className={classes.message}>
          <Typography variant="h5">{message}</Typography>
          {showProgress ? (
            <CircularProgress
              color={'secondary'}
              disableShrink
              className={classes.progressIcon}
            />
          ) : (
            <div />
          )}
        </div>
      </div>
    </React.Fragment>
  )
}

const handleClick = (url: string): void => {
  window.open(url, '_self')
}

export default InitPanel
