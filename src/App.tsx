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
import { basename } from 'path'
import { KeycloakContextProvider } from './context/KeycloakContextProvider'
// import { KeycloakContextProvider } from './context/KeycloakContextProvider'

const defNdexCredential: NdexCredential = {
  loaded: true,
  isLogin: false,
  isGoogle: false,
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

  const [ndexLoginWrapper, setNdexLoginWrapper] = useState(null)

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

    ndexLoginWrapper,
    setNdexLoginWrapper,

    keycloak,
  }

  const routes = [
    // {
    //   path: '/silent-check-sso.html',
    //   element: <Navigate to="/networks" />,
    //   // loader: ({ params }) => {
    //   //   const loc = window.location
    //   //   console.log('LD:', params['*'], loc)
    //   // },
    //   // action: ({ params }) => {
    //   //   console.log('ACTION', params['*'])
    //   // },
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
