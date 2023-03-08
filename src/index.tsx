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
import { KeycloakContextProvider } from './context/KeycloakContextProvider'

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

const render = (config: AppConfig): void => {
  ReactDOM.render(
    <KeycloakContextProvider keycloakConfig={config.keycloakConfig}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <App config={config} />
          </ErrorBoundary>
        </QueryClientProvider>
      </ThemeProvider>
    </KeycloakContextProvider>,
    document.getElementById(ROOT_TAG),
  )
}

// Load resource and start the app.
loadResource().then((config: AppConfig) => {
  render(config)
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
