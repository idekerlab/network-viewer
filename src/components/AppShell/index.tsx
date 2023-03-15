import { FC, Suspense, useEffect } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import AppContext from '../../context/AppState'
import { useContext } from 'react'
import CoreComponents from './CoreComponents'
import { KeycloakTokenParsed } from 'keycloak-js'
import { AuthType } from '../../model/AuthType'
import NdexCredential from '../../model/NdexCredential'

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

const AppShell: FC = () => {
  const classes = useStyles()
  const { keycloak, setIsReady, isReady, ndexCredential, setNdexCredential } =
    useContext(AppContext)

  useEffect(() => {
    const init = () => {
      setIsReady(true)
      localStorage.setItem('keycloakInit', 'false')
      console.log(
        'Credential init OK=============================',
        keycloak,
        isReady,
      )
    }

    // Check if the user is authenticated via Basic Auth
    if (
      ndexCredential !== undefined &&
      ndexCredential.accesskey !== undefined
    ) {
      init()
      return
    }
    console.log('KC is ready-----------INIT in the shell2', keycloak, isReady)
    const isAuth: boolean = keycloak.authenticated

    if (isAuth && keycloak.tokenParsed !== undefined) {
      keycloak
        .loadUserProfile()
        .then(function (profile) {
          console.log('Got P+++++++++++++++++', profile)
        })
        .catch((error) => {
          console.warn('Failed to load user profile')
        })
    } else {
      // This is a hack: emulating a silent reload.
      const keycloakInit = localStorage.getItem('keycloakInit')
      if (keycloakInit === 'false') {
        localStorage.setItem('keycloakInit', 'true')
        keycloak
          .login({
            prompt: 'none',
          })
          .then(() => {
            if (keycloak.authenticated) {
              setNdexCredential({
                authType: AuthType.KEYCLOAK,
                userName: keycloak.tokenParsed.preferred_username,
                accesskey: keycloak.token,
                fullName: keycloak.tokenParsed.name,
              } as NdexCredential)
              console.log('* Authenticated via keycloak')
            } else {
              // Failed
              setNdexCredential({
                authType: AuthType.NONE,
              } as NdexCredential)
              console.log('Not authenticated')
            }
          })
      }
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
