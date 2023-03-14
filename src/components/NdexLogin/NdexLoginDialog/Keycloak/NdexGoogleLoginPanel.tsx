import GoogleLogo from '../../assets/images/google-logo.svg'
import GoogleLogoDisabled from '../../assets/images/google-logo-disabled.svg'
import { Button, Tooltip, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { useContext } from 'react'
import AppContext from '../../../../context/AppState'

const useStyles = makeStyles({
  googlePanel: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const NdexGoogleLoginPanel = (props) => {
  const classes = useStyles()
  const { keycloak } = useContext(AppContext)

  const handleLogin = () => {
    keycloak.login()
  }

  return (
    <Tooltip
      placement={'left'}
      title={
        <>
          <Typography variant={'subtitle1'} color={'inherit'}>
            Currently this feature is only available for test and public servers
          </Typography>
          <Typography variant={'body1'}>
            {'Server selected: ' + props.ndexServer}
          </Typography>
        </>
      }
    >
      <div className={classes.googlePanel}>
        <Button id="googleSignInButtonId" onClick={handleLogin}>
          <span className="google-sign-in-button-span">
            <img src={GoogleLogo} alt="" className="googleLogo" />
            <div className="googleSignInText">Sign in with Google</div>
          </span>
        </Button>
      </div>
    </Tooltip>
  )
}

export default NdexGoogleLoginPanel
