import React, { FC, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import { NDExSignInButton } from 'cytoscape-explore-components'

import AppContext from '../../context/AppState'
import ClassicModeButton from './ClassicModeButton'
import NdexHomeButton from './NdexHomeButton'
import AdvancedMenu from './AdvancedMenu'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'fixed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      top: theme.spacing(1),
      left: theme.spacing(1),
      height: '3em',
      padding: theme.spacing(1),
      background: 'rgba(255, 255, 255, 0.95)',
      zIndex: 300,
      borderRadius: 5,
    },
  }),
)

const ToolBar: FC = (props) => {
  const classes = useStyles()

  const { config, summary, ndexCredential, setNdexCredential } = useContext(AppContext)

  const loginStateUpdated = (loginState) => {
    if (loginState) {
      if (loginState.isGoogle) {
        setNdexCredential({ loaded: true, isLogin: true, isGoogle: true, oauth: loginState })
      } else {
        const details = loginState.loginDetails
        setNdexCredential({
          loaded: true,
          isLogin: true,
          isGoogle: false,
          basic: { userId: details.id, password: details.password },
        })
      }
    } else {
      if (ndexCredential.loaded && ndexCredential.isLogin) {
        console.log('going from logged in to logged out: ', summary)
        if (summary.visibility == 'PRIVATE') {
          window.location.href = 'https://' + config.ndexUrl
        }
      }
      setNdexCredential({
        loaded: true,
        isLogin: false,
        isGoogle: false,
      })
    }
  }

  const getCurrentPrefix  = () =>  {
    if (window.location.href.startsWith('https')) {
        return 'https://'
    } else {
      return 'http;//'
    }
  }

  return (
    <div className={classes.root}>
      <Grid container direction="row" justify="flex-start" alignItems="center" spacing={0}>
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <NdexHomeButton />
          <NDExSignInButton
            size="small"
            myAccountURL={getCurrentPrefix() + config.ndexUrl + '/#/myAccount'}
            onLoginStateUpdated={loginStateUpdated}
          />
          <AdvancedMenu />
          <ClassicModeButton />
        </Grid>
        <Grid container direction="row" justify="flex-end" alignItems="center"></Grid>
      </Grid>
    </div>
  )
}

export default ToolBar
