import { NdexSignUpPanel } from 'cytoscape-explore-components'
import { handleNDExSignOn } from 'cytoscape-explore-components'

import { getCurrentServer } from '../../utils/locationUtil'

import React, { FC, useState } from 'react'
import Container from '@material-ui/core/Container';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

import AppContext from '../../context/AppState'
import { useContext } from 'react'
import { Typography } from '@material-ui/core';

import logo from '../../assets/images/ndex-logo.svg'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    accountShell: {
      width: '100%',
      height: '100%',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    },
    ndexLogo: {
      height: '3em',
    }
  }),
)


const AccountSignUpPane: FC = () => {
  const classes = useStyles()
  const { config } = useContext(AppContext)

  const baseUrl: string = getCurrentServer();

  const [showHomeLink, setShowHomeLink] = useState(false);

  const onSuccessLogin = () => {
    console.log("Here we are.");
  }

  return (
    <Container maxWidth="sm">
      <img alt="NDEx Logo" src={logo} className={classes.ndexLogo} /><Typography variant="subtitle1" display="inline">Sign Up for NDEx</Typography>
      <NdexSignUpPanel handleNDExSignOn={handleNDExSignOn} onSuccessLogin={onSuccessLogin} />
      { showHomeLink && "Go home!"}
    </Container>
  )
}

export default AccountSignUpPane