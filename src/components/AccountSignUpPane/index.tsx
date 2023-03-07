import { getCurrentServer } from '../../utils/locationUtil'

import { FC, useState } from 'react'
import { Grid } from '@material-ui/core'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

import { useEffect } from 'react'
import { Button, Typography } from '@material-ui/core'

import logo from '../../assets/images/ndex-logo.svg'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '40em',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    },
    ndexLogo: {
      height: '3em',
      'vertical-align': 'middle',
    },
    titleText: {
      'vertical-align': 'middle',
      'padding-left': '1em',
      'line-height': '2em',
    },
    homeButton: {
      color: 'white',
      'background-color': '#337ab7',
      textTransform: 'none',
    },
    footer: {
      'text-align': 'center',
    },
  }),
)

const AccountSignUpPane: FC = () => {
  const classes = useStyles()

  useEffect(() => {
    document.title = 'Sign Up for NDEx'
  }, [])

  const baseUrl: string = getCurrentServer()

  const [showHomeLink, setShowHomeLink] = useState(false)

  const onSuccessLogin = () => {
    window.open(baseUrl + '/#/myAccount', '_self')
  }

  const handleHomeClick = () => {
    window.open(baseUrl, '_self')
  }

  const onWaitForEmailValidation = (userInfo, onSuccessLogin) => {
    setShowHomeLink(true)
  }

  return (
    <Grid container className={classes.root}>
      <Grid container alignItems={'center'} justify={'center'}>
        <Grid item>
          <img alt="NDEx Logo" src={logo} className={classes.ndexLogo} />
        </Grid>
        <Grid item>
          <Typography
            variant="h6"
            display="inline"
            className={classes.titleText}
          >
            Sign Up for NDEx
          </Typography>
        </Grid>
      </Grid>
      {/* <NdexSignUpPanel
        handleNDExSignOn={handleNDExSignOn}
        onSuccessLogin={onSuccessLogin}
        onWaitForEmailValidation={onWaitForEmailValidation}
      /> */}
      {showHomeLink && (
        <div className={classes.footer}>
          <Button onClick={handleHomeClick} className={classes.homeButton}>
            Go to NDEx Home Page
          </Button>
        </div>
      )}
    </Grid>
  )
}

export default AccountSignUpPane
