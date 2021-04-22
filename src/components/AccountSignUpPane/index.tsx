import { NdexSignUpPanel } from 'cytoscape-explore-components'
import { handleNDExSignOn } from 'cytoscape-explore-components'

import { getCurrentServer } from '../../utils/locationUtil'

import { FC, useState } from 'react'
import Container from '@material-ui/core/Container';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

import { useEffect } from 'react'
import { Button, Typography } from '@material-ui/core';

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
      'vertical-align': 'middle'
    },
    titleText: {
      'vertical-align': 'middle',
      'padding-left': '1em',
      'line-height': '2em'
    },
    homeButton: {
      'color': 'white',
      'background-color': '#337ab7',
      textTransform: 'none'
    },
    footer : {
      'text-align' : 'center'
    }
  }),
)


const AccountSignUpPane: FC = () => {
  const classes = useStyles()
 
  useEffect(() => {
    document.title = "Sign Up for NDEx"
  }, []);

  const baseUrl: string = getCurrentServer();

  const [showHomeLink, setShowHomeLink] = useState(false);

  const onSuccessLogin = () => {
    window.open(baseUrl + '/#/myAccount', '_self')
  }

  const handleHomeClick = () => {
    window.open(baseUrl, '_self');
  }

  const onWaitForEmailValidation = (userInfo, onSuccessLogin) => {
    setShowHomeLink(true);
  }

  return (
    <Container maxWidth="sm">
      <div>
        <img alt="NDEx Logo" src={logo} className={classes.ndexLogo} /><Typography variant="subtitle1" display="inline" className={classes.titleText}>Sign Up for NDEx</Typography>
      </div>
      <NdexSignUpPanel handleNDExSignOn={handleNDExSignOn} onSuccessLogin={onSuccessLogin} onWaitForEmailValidation={onWaitForEmailValidation}/>
      { showHomeLink &&
        <div className={classes.footer}>
         <Button onClick={handleHomeClick} className={classes.homeButton}>Go to NDEx Home Page</Button>
        </div>
      }
    </Container>
  )
}

export default AccountSignUpPane