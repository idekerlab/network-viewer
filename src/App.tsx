import React, { useState, useReducer, useEffect } from 'react'
import './App.css'
import { useHistory } from 'react-router-dom'
import { Switch, Route, BrowserRouter } from 'react-router-dom'

import AppShell from './components/AppShell'

import AppContext from './context/AppState'
import AppState from './model/AppState'
import TopPanel from './components/TopPanel'

//import UIState from './model/UIState'
import selectionReducer, { EMPTY_SELECTION } from './reducer/selectionReducer'
import cyReducer, { INITIAL_CY_REFERENCE } from './reducer/cyReducer'
import uiStateReducer, { INITIAL_UI_STATE } from './reducer/uiStateReducer'
import NdexCredential from './model/NdexCredential'

const defNdexCredential: NdexCredential = {
  isLogin: false,
  isGoogle: false,
}

const App = ({ config }) => {
  const history = useHistory(INITIAL_UI_STATE)

  const [query, setQuery] = useState('')
  const [queryMode, setQueryMode] = useState('direct')
  const [summary, setSummary] = useState()

  const [ndexCredential, setNdexCredential] = useState(defNdexCredential)

  const [selection, dispatch] = useReducer(selectionReducer, EMPTY_SELECTION)
  const [cyReference, cyDispatch] = useReducer(cyReducer, INITIAL_CY_REFERENCE)
  const [uiState, uiStateDispatch] = useReducer(uiStateReducer, INITIAL_UI_STATE)

  // TODO: use reducer?
  const defState: AppState = {
    config,

    selection,
    dispatch,

    cyReference,
    cyDispatch,

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
  }

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL} history={history}>
      <Switch>
        <Route path="/networks/:uuid">
          <AppContext.Provider value={defState}>
            <AppShell />
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
