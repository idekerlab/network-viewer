import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from './theme'

import { ReactQueryConfigProvider, ReactQueryCacheProvider, QueryCache } from 'react-query'
import AppConfig from './model/AppConfig'

const ROOT_TAG = 'root'

// This avoids too many fetch calls from remote API
const queryConfig: object = { queries: { refetchOnWindowFocus: false } }
const queryCache = new QueryCache()

async function loadResource() {
  const response = await fetch(`${process.env.PUBLIC_URL}/resource.json`)

  if (response.status !== 200) {
    throw new Error('Failed to load resource file.  Could not find NDEx server location')
  }
  const resource = await response.json()
  console.log('* Resource file loaded:', resource)
  const ndexUrl = resource['ndexUrl']
  const googleClientId = resource['googleClientId']
  const viewerTh = resource['viewerThreshold']
  const maxNumObjects = resource['maxNumObjects']
  const warningThreshold = resource['warningThreshold']

  const config: AppConfig = {
    ndexUrl,
    ndexHttps: `https://${ndexUrl}`,
    googleClientId,
    viewerThreshold: viewerTh,
    maxNumObjects,
    warningThreshold
  }
  
  ReactDOM.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ReactQueryConfigProvider config={queryConfig}>
          <ReactQueryCacheProvider queryCache={queryCache}>
            <App config={config} />
          </ReactQueryCacheProvider>
        </ReactQueryConfigProvider>
      </ThemeProvider>
    </React.StrictMode>,
    document.getElementById(ROOT_TAG),
  )
}

// Load resource and start the app.
loadResource()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
