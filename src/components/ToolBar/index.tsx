import React, { FC, useContext } from 'react'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import { NDExSignInButton } from 'cytoscape-explore-components'

import AppContext from '../../context/AppState'
import ClassicModeButton from './ClassicModeButton'
import NdexHomeButton from './NdexHomeButton'


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
      zIndex: 1000,
      borderRadius: 5
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '20ch',
        '&:focus': {
          width: '25ch',
        },
      },
    },
  }),
)

const ToolBar: FC = (props) => {
  const classes = useStyles()

  const { setNdexCredential } = useContext(AppContext)

  const loginStateUpdated = (loginState) => {
    if (loginState) {
    if (loginState.isGoogle) {
      setNdexCredential({ isLogin: true, isGoogle: true, oauth: loginState })
    } else {
      const details = loginState.loginDetails
      setNdexCredential({
        isLogin: true,
        isGoogle: false,
        basic: { userId: details.id, password: details.password },
      })
    }
    } else {
      setNdexCredential({
          isLogin: false,
          isGoogle: false
      });
    }
  }

  return (
    <div className={classes.root}>
      <Grid container direction="row" justify="flex-start" alignItems="center" spacing={0}>
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <NdexHomeButton />
          <NDExSignInButton size="small" onLoginStateUpdated={loginStateUpdated} />
          <ClassicModeButton />
        </Grid>
        <Grid container direction="row" justify="flex-end" alignItems="center"></Grid>
      </Grid>
    </div>
  )
}

export default ToolBar
