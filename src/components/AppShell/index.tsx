import { FC, Suspense, useEffect } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import AppContext from '../../context/AppState'
import { useContext } from 'react'
import CoreComponents from './CoreComponents'
import { KeycloakTokenParsed } from 'keycloak-js'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appShell: {
      width: '100%',
      height: '100%',
      padding: 0,
      margin: 0,
      boxSizing: 'border-box',
    },
    sandbox: {
      position: 'absolute',
      left: '-999em',
    },
  }),
)

const SILENT_TAG = '/viewer/silent-check-sso.html'

const AppShell: FC = () => {
  const classes = useStyles()
  const { keycloak, setIsReady, isReady } = useContext(AppContext)

  useEffect(() => {
    console.log('KC is ready-----------INIT in the shell2', keycloak, isReady)
    const isAuth: boolean = keycloak.authenticated

    if (isAuth && keycloak.tokenParsed !== undefined) {
      keycloak
        .loadUserProfile()
        .then(function (profile) {
          console.log('Got P+++++++++++++++++', profile)
        })
        .catch(function () {
          alert('Failed to load user profile')
        })
    } else {
      // This is a hack: emulating a silent reload.
      const keycloakInit = localStorage.getItem('keycloakInit')
      if (keycloakInit === 'false') {
        localStorage.setItem('keycloakInit', 'true')
        keycloak.login({
          prompt: 'none',
        })
      }
    }

    const init = () => {
      console.log('OK=============================', keycloak, isReady)
      setIsReady(true)
      localStorage.setItem('keycloakInit', 'false')
    }
    setTimeout(() => {
      init()
    }, 120)
  }, [])

  if (!isReady) {
    return null
  }
  return (
    <div className={classes.appShell}>
      <CoreComponents />
      <div id="sandbox"></div>
    </div>
  )
}

export default AppShell
