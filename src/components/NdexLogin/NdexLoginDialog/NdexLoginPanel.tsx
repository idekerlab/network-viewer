import { Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import NdexGoogleLoginPanel from './Keycloak/NdexGoogleLoginPanel'
import BasicAuthLoginPanel from './BasicAuth/BasicAuthLoginPanel'

const useStyles = makeStyles({
  root: {
    height: '18em',
    margin: 0,
    padding: '0.6em',
    display: 'flex',
    minWidth: '30em',
  },
  leftComponent: {
    display: 'flex',
    height: '100%',
    alignItem: 'center',
    justifyContent: 'center',
    marginRight: '0.6em',
  },
  rightComponent: {
    height: '100%',
    marginLeft: '0.6em',
    flexGrow: 1,
  },
})

const NdexLoginPanel = (props) => {
  const classes = useStyles()

  const {
    onLoginSuccess,
    onSuccess,
    handleNDExSignOn,
    onSuccessLogin,
    onError,
    ndexServer,
    googleSignIn,
    googleSSO,
    setContentMode,
  } = props

  return (
    <div className={classes.root}>
      <div className={classes.leftComponent}>
        <NdexGoogleLoginPanel
          onError={onError}
          onLoginSuccess={onLoginSuccess}
          onSuccess={onSuccess}
          ndexServer={ndexServer}
          googleSignIn={googleSignIn}
          googleSSO={googleSSO}
        />
      </div>
      <Divider orientation="vertical" flexItem />
      <div className={classes.rightComponent}>
        <BasicAuthLoginPanel
          handleNDExSignOn={handleNDExSignOn}
          onSuccessLogin={onSuccessLogin}
          ndexServer={ndexServer}
          setContentMode={setContentMode}
        />
      </div>
    </div>
  )
}

export default NdexLoginPanel
