import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from './theme'

import { ReactQueryConfigProvider, ReactQueryCacheProvider, QueryCache } from 'react-query'

const ROOT_TAG = 'root'


/**
 * This file contains settings for 3rd party libraries
 */

// This avoids too many fetch calls from remote API
const queryConfig: object = { queries: { refetchOnWindowFocus: false } }
const queryCache = new QueryCache()

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ReactQueryConfigProvider config={queryConfig}>
        <ReactQueryCacheProvider queryCache={queryCache}>
          <App />
        </ReactQueryCacheProvider>
      </ReactQueryConfigProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById(ROOT_TAG),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
