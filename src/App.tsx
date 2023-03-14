import React, { useState, useReducer, useEffect } from 'react'
import { Helmet } from 'react-helmet'

import './App.css'
import {
  Routes,
  Route,
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom'

import AppShell from './components/AppShell'
import AccountShell from './components/AccountShell'
import AccountSignUpPane from './components/AccountSignUpPane'
import AccountForgotPasswordPane from './components/AccountForgotPasswordPane'

import AppContext from './context/AppState'
import AppState from './model/AppState'
import TopPanel from './components/TopPanel'

import selectionStateReducer, {
  EMPTY_SELECTION,
} from './reducer/selectionStateReducer'
import cyReducer, { INITIAL_CY_REFERENCE } from './reducer/cyReducer'
import uiStateReducer, { INITIAL_UI_STATE } from './reducer/uiStateReducer'
import NdexCredential from './model/NdexCredential'
import Summary from './model/Summary'
import { AuthType } from './model/AuthType'
import { getBasicAuth } from './components/NdexLogin/NdexLoginDialog/BasicAuth/basic-auth-util'
import { NdexBasicAuthInfo } from './components/NdexLogin/NdexSignInButton/handleNdexSignOn'

const defNdexCredential: NdexCredential = {
  authType: AuthType.NONE,
  userName: '',
}

const defSummary: Summary = {
  name: 'N/A',
}

const App = ({ config, keycloak }) => {
  const [query, setQuery] = useState('')
  const [queryMode, setQueryMode] = useState('firstStepNeighborhood')
  const [summary, setSummary] = useState(defSummary)

  const [lgrReference, setLgrReference] = useState(null)

  const [ndexCredential, setNdexCredential] = useState(defNdexCredential)

  const [selectionState, selectionStateDispatch] = useReducer(
    selectionStateReducer,
    EMPTY_SELECTION,
  )
  const [cyReference, cyDispatch] = useReducer(cyReducer, INITIAL_CY_REFERENCE)
  const [uiState, uiStateDispatch] = useReducer(
    uiStateReducer,
    INITIAL_UI_STATE,
  )

  const [isReady, setIsReady] = useState<boolean>(false)
  const [showLogin, setShowLogin] = useState<boolean>(false)

  useEffect(() => {
    if (keycloak === undefined) {
      return
    }

    console.info('Checking your login status before loading app', keycloak)
    let credential: NdexCredential

    // Check basic auth
    const basicAuthInfo: NdexBasicAuthInfo = getBasicAuth()
    if (basicAuthInfo !== undefined) {
      // use basic auth
      credential = {
        authType: AuthType.BASIC,
        userName: basicAuthInfo.id,
        accesskey: basicAuthInfo.password,
        fullName: basicAuthInfo.firstName + ' ' + basicAuthInfo.lastName,
      } as const
    } else if (keycloak.authenticated) {
      credential = {
        authType: AuthType.KEYCLOAK,
        userName: keycloak.tokenParsed.preferred_username,
        accesskey: keycloak.token,
        fullName: keycloak.tokenParsed.name,
      } as const
    } else {
      credential = {
        authType: AuthType.NONE,
      } as const
    }
    setNdexCredential(credential)
  }, [keycloak])

  // TODO: use reducer?
  const defState: AppState = {
    config,

    cyReference,
    cyDispatch,

    lgrReference,
    setLgrReference,

    uiState,
    uiStateDispatch,

    query,
    setQuery,
    queryMode,
    setQueryMode,

    ndexCredential,
    setNdexCredential,

    summary,
    setSummary,

    selectionState,
    selectionStateDispatch,

    keycloak,
    isReady,
    setIsReady,

    showLogin,
    setShowLogin,
  }

  const routes = [
    // {
    //   path: '/silent-check-sso.html',
    //   element: (
    //     <AppContext.Provider value={defState}>
    //       <AppShell />
    //     </AppContext.Provider>
    //   ),
    // },
    {
      path: '/networks/:uuid',
      element: (
        <AppContext.Provider value={defState}>
          <AppShell />
        </AppContext.Provider>
      ),
    },
    {
      path: '/signup',
      element: (
        <AppContext.Provider value={defState}>
          <AccountShell>
            <AccountSignUpPane />
          </AccountShell>
        </AppContext.Provider>
      ),
    },
    {
      path: '/recoverPassword',
      element: (
        <AppContext.Provider value={defState}>
          <AccountShell>
            <AccountForgotPasswordPane />
          </AccountShell>
        </AppContext.Provider>
      ),
    },
    {
      path: '/',
      element: <TopPanel config={config} />,
    },
  ]
  const router = createBrowserRouter(routes, {
    basename: process.env.PUBLIC_URL,
  })

  return <RouterProvider router={router} />
}

export default App
