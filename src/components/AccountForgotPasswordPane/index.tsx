import { getCurrentServer } from '../../utils/locationUtil'

import { FC, useState } from 'react'
import { Grid } from '@material-ui/core'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

import { useEffect } from 'react'
import { Typography, Button } from '@material-ui/core'

import logo from '../../assets/images/ndex-logo.svg'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: '32em',
      margin: 0,
      padding: 0,
    },
    ndexLogo: {
      height: '3em',
      'vertical-align': 'middle',
    },
    titleText: {
      'vertical-align': 'middle',
    },
    homeButton: {
      color: 'white',
      'background-color': '#337ab7',
      textTransform: 'none',
    },
    footer: {
      marginTop: '5em',
    },
    row: {
      marginBottom: '1em',
    },
  }),
)

const AccountForgotPasswordPane: FC = () => {
  const classes = useStyles()

  const [showHomeLink, setShowHomeLink] = useState(false)

  const baseUrl: string = getCurrentServer()

  useEffect(() => {
    document.title = 'Recover NDEx Password'
  }, [])

  const handleHomeClick = () => {
    window.open(baseUrl, '_self')
  }

  const onSuccessReset = (email: String): void => {
    setShowHomeLink(true)
  }

  return (
    <Grid container className={classes.root} spacing={5}>
      <Grid
        className={classes.row}
        container
        justify={'center'}
        alignItems={'center'}
        xs={12}
        spacing={2}
      >
        <Grid item>
          <img alt="NDEx Logo" src={logo} className={classes.ndexLogo} />
        </Grid>
        <Grid item>
          <Typography
            variant="h6"
            display="inline"
            className={classes.titleText}
          >
            Recover NDEx Password
          </Typography>
        </Grid>
      </Grid>
      <Grid
        className={classes.row}
        container
        justify={'center'}
        alignItems={'center'}
        xs={12}
      >
        {/* <ForgotPasswordPanel onSuccessReset={onSuccessReset} /> */}
        {showHomeLink && (
          <div className={classes.footer}>
            <Button
              fullWidth
              onClick={handleHomeClick}
              className={classes.homeButton}
            >
              Go to NDEx Home Page to Sing In
            </Button>
          </div>
        )}
      </Grid>
    </Grid>
  )
}

export default AccountForgotPasswordPane
