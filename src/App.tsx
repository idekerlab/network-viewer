import React, { useState, useReducer } from 'react'
import { Helmet } from 'react-helmet'

import './App.css'
import { useHistory } from 'react-router-dom'
import { Switch, Route, BrowserRouter } from 'react-router-dom'

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

const defNdexCredential: NdexCredential = {
  loaded: false,
  isLogin: false,
  isGoogle: false,
}

const defSummary: Summary = {
  name: 'N/A',
}

const App = ({ config }) => {
  const history = useHistory(INITIAL_UI_STATE)

  const [query, setQuery] = useState('')
  const [queryMode, setQueryMode] = useState('firstStepNeighborhood')
  const [summary, setSummary] = useState(defSummary)

  const [lgrReference, setLgrReference] = useState(null)

  
  const { googleClientId } = config
  if(googleClientId === undefined) {
    // Google login feature will not be used. Assume credential is ready
    // defNdexCredential.loaded = true
  }
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
  }

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL} history={history}>
      <Switch>
        <Route path="/networks/:uuid">
          <AppContext.Provider value={defState}>
            <AppShell />
          </AppContext.Provider>
        </Route>
        <Route path="/signup">
          <AppContext.Provider value={defState}>
            <AccountShell>
              <AccountSignUpPane />
            </AccountShell>
          </AppContext.Provider>
        </Route>
        <Route path="/recoverPassword">
          <AppContext.Provider value={defState}>
            <AccountShell>
              <AccountForgotPasswordPane />
            </AccountShell>
          </AppContext.Provider>
        </Route>
        <Route path="/">
          <TopPanel config={config} />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App
