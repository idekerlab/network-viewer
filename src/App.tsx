import React, { useState, useReducer } from 'react'
import './App.css'
import { useHistory } from 'react-router-dom'
import { Switch, Route, BrowserRouter } from 'react-router-dom'

import AppShell from './components/AppShell'

import AppContext from './context/AppState'
import AppState from './model/AppState'
import TopPanel from './components/TopPanel'

import UIState from './model/UIState'
import selectionReducer, { EMPTY_SELECTION } from './reducer/selectionReducer'
import cyReducer, { INITIAL_CY_REFERENCE } from './reducer/cyReducer'
import NdexCredential from './model/NdexCredential'
import AppConfig from './model/AppConfig'

const defUIState: UIState = {
  dataPanelOpen: true,
  showSearchResult: false,
  showPropPanel: false,
  pointerPosition: {
    x: 200,
    y: 500,
  },
}

const defNdexCredential: NdexCredential = {
  isLogin: false,
  isGoogle: false,
}

const defConfig: AppConfig = {
  ndexUrl: '',
}

const App = () => {
  
  const [config, setConfig] = useState(defConfig)
  
  async function loadResource() {
    const response = await fetch(`${process.env.PUBLIC_URL}/resource.json`)

    if (response.status !== 200) {
      throw new Error('Failed to load resource file.  Could not find NDEx server location')
    }
    const resource = await response.json()
    console.log('- Resource file loaded:', resource)
    const ndexUrl = resource['ndexUrl']

    const config: AppConfig = {
      ndexUrl
    }
    
    setConfig(config)
  }
  
  loadResource()

  const history = useHistory(defUIState)
  const [uiState, setUIState] = useState(defUIState)
  const [uuid, setUuid] = useState('')
  const [summary, setSummary] = useState({})
  const [style, setStyle] = useState({})
  const [query, setQuery] = useState('')
  const [queryMode, setQueryMode] = useState('direct')
  const [queryResult, setQueryResult] = useState(null)

  const [ndexCredential, setNdexCredential] = useState(defNdexCredential)

  const [selectedNodeAttributes, setSelectedNodeAttributes] = useState({})

  const [selection, dispatch] = useReducer(selectionReducer, EMPTY_SELECTION)
  const [cyReference, cyDispatch] = useReducer(cyReducer, INITIAL_CY_REFERENCE)

  // TODO: use reducer?
  const defState: AppState = {
    config,

    selection,
    dispatch,

    cyReference,
    cyDispatch,

    uiState,
    setUIState,
    style,
    setStyle,
    selectedNodeAttributes,
    setSelectedNodeAttributes,
    summary,
    setSummary,
    uuid,
    setUuid,

    query,
    setQuery,
    queryMode,
    setQueryMode,
    queryResult,
    setQueryResult,

    ndexCredential,
    setNdexCredential,
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
          <TopPanel />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App
