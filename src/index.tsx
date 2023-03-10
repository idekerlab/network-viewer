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

const ROOT_TAG = 'root'

const originalLoc = window.location.pathname
localStorage.setItem('originalLoc', originalLoc)

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
    ndexHttps:
      ndexUrl === 'localhost' ? `http://${ndexUrl}` : `https://${ndexUrl}`,
    viewerThreshold: viewerTh,
    maxNumObjects,
    maxDataSize,
    maxEdgeQuery,
    warningThreshold,
    keycloakConfig,
  }

  return config
}

const auth = async (config: AppConfig): Promise<Keycloak> => {
  const newClient = new Keycloak(config.keycloakConfig)

  console.log('Original URL', window.location)
  try {
    await newClient.init({
      // onLoad: 'check-sso',

      checkLoginIframe: true,
      silentCheckSsoRedirectUri:
        window.location.origin + `/viewer/silent-check-sso.html`,
    })
  } catch (e) {
    console.log('Keycloak init failed', e)
    throw new Error('Keycloak init failed', e)
  }
  console.log('Keycloak initialized in the root', newClient)
  if (newClient.authenticated) {
    console.log(
      '* User authenticated: ready to load app',
      newClient.tokenParsed,
    )
  } else {
    console.log('* Not authenticated')
  }

  return newClient
}

const render = (config: AppConfig, keycloak?: Keycloak): void => {
  console.log(
    '* Rendering start. If you see this more than once, it might be a bug...',
    config,
    keycloak,
    window.location,
  )
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <App config={config} keycloak={keycloak} />
        </ErrorBoundary>
      </QueryClientProvider>
    </ThemeProvider>,
    document.getElementById(ROOT_TAG),
  )
}

// Start the app modules in sequence.
loadResource().then((config: AppConfig) => {
  auth(config).then((keycloak) => {
    render(config, keycloak)
  })
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
