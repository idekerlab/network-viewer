import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from './theme'
import ErrorBoundary from './components/ErrorBoundary'

import { QueryClientProvider, QueryCache, QueryClient } from 'react-query'
import AppConfig from './model/AppConfig'
import Keycloak from 'keycloak-js'
import NdexCredential from './model/NdexCredential'
import { EmailVerificationPanel } from './components/EmailVerification'
import { NDEx } from '@js4cytoscape/ndex-client'

interface UserInfo {
  preferred_username: string
  email: string
}

const ROOT_TAG = 'root'

// Avoid HTTP
const location = window.location
if (location.hostname !== 'localhost' && location.protocol !== 'https:') {
  location.replace(`https:${location.href.substring(location.protocol.length)}`)
}

// Remove duplicate slashes if necessary
const baseUrl = location.href
const protocol = baseUrl.split('//')[0]
const urlBody = baseUrl.replace(`${protocol}//`, '')
const updatedUrl = urlBody.replace(/\/\/+/g, '/')
if (updatedUrl !== urlBody) {
  location.replace(`${protocol}//${updatedUrl}`)
}

// This avoids too many fetch calls from remote API
const queryConfig = { queries: { refetchOnWindowFocus: false } }
const queryCache = new QueryCache()
const queryClient = new QueryClient({ queryCache, defaultOptions: queryConfig })

const loadResource = async (): Promise<AppConfig> => {
  const response = await fetch(`${process.env.PUBLIC_URL}/resource.json`)

  if (response.status !== 200) {
    throw new Error(
      'Failed to load resource file.  Could not find NDEx server location',
    )
  }
  const resource = await response.json()
  const ndexUrl = resource['ndexUrl']
  const viewerTh = resource['viewerThreshold']
  const maxNumObjects = resource['maxNumObjects']
  const maxEdgeQuery = resource['maxEdgeQuery']
  const maxDataSize = resource['maxDataSize']
  const warningThreshold = resource['warningThreshold']
  const keycloakConfig = resource['keycloakConfig']

  const config: AppConfig = {
    ndexUrl,
    ndexHttps: ndexUrl.startsWith('localhost')
      ? `http://${ndexUrl}`
      : `https://${ndexUrl}`,
    viewerThreshold: viewerTh,
    maxNumObjects,
    maxDataSize,
    maxEdgeQuery,
    warningThreshold,
    keycloakConfig,
  }

  return config
}
/*
const loadKeycloakScript = async (keycloakURL : String): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = keycloakURL + '/js/keycloak.js';
    script.onload = () => resolve();
    script.onerror = (error) => reject(new Error(`Failed to load Keycloak script: ${error}`));
    document.head.appendChild(script);
  });
}; */

const auth = async (config: AppConfig): Promise<Keycloak> => {
  const newClient = new Keycloak(config.keycloakConfig)
  try {
    // TODO: initialization with silent check does not work.
    // For now, just initialize without silent check and manually login later if necessary.
    await newClient.init({
      onLoad: 'check-sso',
      checkLoginIframe: false,
      responseMode: 'query',
      // silentCheckSsoRedirectUri:
      //   window.location.origin + '/viewer/silent-check-sso.html',
    })
  } catch (e) {
    console.log('Keycloak init failed', e)
    throw new Error('Keycloak init failed', e)
  }

  // // try login
  // const isLogin: string = localStorage.getItem('keycloakLogin')

  // if (isLogin !== 'true') {
  //   localStorage.setItem('keycloakLogin', 'true')
  //   newClient
  //     .login({
  //       prompt: 'none',
  //     })
  //     .then(() => {
  //       if (newClient.authenticated) {
  //         // setNdexCredential({
  //         //   authType: AuthType.KEYCLOAK,
  //         //   userName: keycloak.tokenParsed.preferred_username,
  //         //   accesskey: keycloak.token,
  //         //   fullName: keycloak.tokenParsed.name,
  //         // } as NdexCredential)
  //         console.log('* Authenticated via keycloak')
  //         // Record this in local storage to avoid multiple login attempts
  //       } else {
  //         // Failed
  //         // setNdexCredential({
  //         //   authType: AuthType.NONE,
  //         // } as NdexCredential)
  //         console.log('Not authenticated')
  //       }
  //       setTimeout(() => {
  //         localStorage.setItem('keycloakLogin', 'false')
  //       }, 3000)
  //     })
  // }
  if (newClient.authenticated) {
    console.log('* User authenticated: via Keycloak', newClient.tokenParsed)
  } else {
    console.log('* Keycloak initialized without authentication')
  }

  return newClient
}

const checkInitialLoginStatus = (keycloak: Keycloak): NdexCredential => {
  console.info(
    'INDEX:: Checking your login status before loading app',
    keycloak,
  )
  let credential: NdexCredential

  if (keycloak.authenticated) {
    credential = {
      authenticated: true,
      userName: keycloak.tokenParsed.preferred_username,
      idToken: keycloak.token,
      fullName: keycloak.tokenParsed.name,
    } as const
  } else {
    credential = {
      authenticated: false,
    } as const
  }
  return credential
}

const render = (
  config: AppConfig,
  keycloak: Keycloak,
  credential: NdexCredential,
  emailVerificationOpen: boolean,
  onVerify: () => Promise<void>,
  onCancel: () => void,
  userName: string,
  userEmail: string,
): void => {
  console.log(
    '* Root component rendering start. If you see this more than once, it might be a bug...',
    config,
    keycloak,
    window.location,
  )
  if (emailVerificationOpen) {
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <EmailVerificationPanel
              onVerify={onVerify}
              onCancel={onCancel}
              userName={userName}
              userEmail={userEmail}
            />
          </ErrorBoundary>
        </QueryClientProvider>
      </ThemeProvider>,
      document.getElementById(ROOT_TAG),
    )
  } else {
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <App config={config} keycloak={keycloak} credential={credential} />
          </ErrorBoundary>
        </QueryClientProvider>
      </ThemeProvider>,
      document.getElementById(ROOT_TAG),
    )
  }
}

// Function to parse the error message to get the user information
const parseMessage = (
  message: string,
): { userName: string; userEmail: string } | null => {
  const pattern = /NDEx user account ([\w.]+) <([\w.]+@[\w.]+)>/
  const match = message.match(pattern)

  if (match) {
    const userName = match[1]
    const userEmail = match[2]
    return { userName, userEmail }
  }
  return null
}

// Function to check if the email is verified
const checkEmailVerification = async (
  ndexUrl: string,
  keycloakToken: string,
) => {
  try {
    const ndexClient = new NDEx(ndexUrl)
    const userObj = await ndexClient.signInFromIdToken(keycloakToken)
    return {
      isVerified: true,
    }
  } catch (e) {
    if (
      e.status === 401 &&
      e.response?.data?.errorCode === 'NDEx_User_Account_Not_Verified'
    ) {
      const userInfo = parseMessage(e.response?.data?.message)
      return {
        isVerified: false,
        userName: userInfo?.userName,
        userEmail: userInfo?.userEmail,
      }
    }
    return {
      isVerified: true,
    }
  }
}

// Start the app modules in sequence.
const initializeApp = async (): Promise<void> => {
  try {
    const config = await loadResource()
    //await loadKeycloakScript(config.keycloakConfig.url);
    const newClient = await auth(config)
    const credential = checkInitialLoginStatus(newClient)
    const onVerify = async () => {
      window.location.reload()
    }
    const onCancel = () => {
      newClient.logout()
    }
    const authByKeycloak = newClient.authenticated
    let emailUnverified = true
    let userName = ''
    let userEmail = ''
    if (authByKeycloak) {
      const verificationStatus = await checkEmailVerification(
        config.ndexUrl,
        newClient.token,
      )
      emailUnverified = !verificationStatus.isVerified
      userName = verificationStatus.userName ?? ''
      userEmail = verificationStatus.userEmail ?? ''
    }
    render(
      config,
      newClient,
      credential,
      authByKeycloak && emailUnverified,
      onVerify,
      onCancel,
      userName,
      userEmail,
    )
  } catch (error) {
    console.error('Application initialization failed:', error)
  }
}

initializeApp()

/* old implementation
loadResource().then((config: AppConfig) => {
  auth(config).then((newClient: Keycloak) => {
    const credential = checkInitialLoginStatus(newClient)
    render(config, newClient, credential)
  })
}) */

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
