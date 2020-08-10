import React, { useState, useReducer } from 'react'
import './App.css'
import { useHistory } from 'react-router-dom'
import { Switch, Route, BrowserRouter } from 'react-router-dom'

import AppShell from './components/AppShell'

import AppContext from './context/AppState'
import AppState from './model/AppState'
import TopPanel from './components/TopPanel'

import UIState from './model/UIState'
import CyReference from './model/CyReference'
import selectionReducer, {EMPTY_SELECTION} from './reducer/selectionReducer'

const defUIState: UIState = {
  dataPanelOpen: true,
  showSearchResult: false,
}

const defCyRef: CyReference = {}

const App = () => {
  const history = useHistory(defUIState)
  const [uiState, setUIState] = useState(defUIState)
  const [uuid, setUuid] = useState('')
  const [cx, setCx] = useState([])
  const [cyReference, setCyReference] = useState(defCyRef)
  const [summary, setSummary] = useState({})
  const [style, setStyle] = useState({})
  const [query, setQuery] = useState('')
  const [queryMode, setQueryMode] = useState('direct')
  const [queryResult, setQueryResult] = useState(null)

  const [selectedNodeAttributes, setSelectedNodeAttributes] = useState({})

  const [selection, dispatch] = useReducer(selectionReducer, EMPTY_SELECTION)

  // TODO: use reducer?
  const defState: AppState = {

    selection,
    dispatch,

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
    cx,
    setCx,
    cyReference,
    setCyReference,
    query,
    setQuery,
    queryMode,
    setQueryMode,
    queryResult,
    setQueryResult,
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
