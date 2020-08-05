import React, { FC } from 'react'
import IconButton from '@material-ui/core/IconButton'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import AccountCircle from '@material-ui/icons/AccountCircle'
import AppsIcon from '@material-ui/icons/Apps'
import Grid from '@material-ui/core/Grid'

import logo from '../../assets/images/ndex-logo.svg'


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {

      position: 'fixed',
      top: 0,
      left: 0,
      width: '20vw',
      height: '5vh',
      padding: 0,
      background: 'rgba(250, 250, 250, 0)',
      zIndex: 1000,
    },
    ndexLogo: {
      height: '3vh',
    },
    menuButton: {
      marginRight: 0,
    },
    menuButtonHidden: {
      display: 'none',
    },
    title: {
      flexGrow: 1,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
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
    formControl: {
      margin: theme.spacing(0),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(0),
    },
    searchType: {
      width: '20ch',
      padding: 0,
    },
  }),
)

const ToolBar: FC = (props) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Grid container direction="row" justify="flex-start" alignItems="center" spacing={0}>
        <Grid container direction="row" justify="flex-start" alignItems="center" >
          <IconButton color="default" aria-label="Ndex Home">
            <img alt="NDEx logo" src={logo} className={classes.ndexLogo} />
          </IconButton>
          <IconButton aria-label="open in external apps" aria-haspopup="true" color="inherit">
            <AppsIcon />
          </IconButton>
          <IconButton aria-label="account of current user" aria-haspopup="true" color="inherit">
            <AccountCircle />
          </IconButton>
        </Grid>
        <Grid container direction="row" justify="flex-end" alignItems="center">
        </Grid>
      </Grid>
    </div>
  )
}

export default ToolBar
