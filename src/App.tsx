import React, { useState } from 'react'
import './App.css'
import { useHistory } from 'react-router-dom'
import { Route, BrowserRouter as Router, Link, useRouteMatch } from 'react-router-dom'

import BasePanel from './components/BasePanel'

import AppContext from './context/AppState'
import AppState from './model/AppState'

const App = () => {
  const history = useHistory()
  const [uuid, setUuid] = useState('')
  const [cx, setCx] = useState([])
  const [summary, setSummary] = useState({})
  const [style, setStyle] = useState({})
  const [query, setQuery] = useState('')
  const [queryMode, setQueryMode] = useState('direct')
  const [selectedNodes, setSelectedNodes] = useState([])
  const [selectedEdges, setSelectedEdges] = useState([])

  const [selectedNodeAttributes, setSelectedNodeAttributes] = useState({})

  // TODO: use reducer?
  const defState: AppState = {
    network: {},
    style,
    setStyle,
    selectedNodes,
    selectedNodeAttributes,
    setSelectedNodeAttributes,
    setSelectedNodes,
    selectedEdges,
    setSelectedEdges,
    summary,
    setSummary,
    uuid,
    setUuid,
    cx,
    setCx,
    query,
    setQuery,
    queryMode,
    setQueryMode,
  }

  return (
    <Router>
      <Route path="/networks/:uuid">
        <AppContext.Provider value={defState}>
          <BasePanel />
        </AppContext.Provider>
      </Route>
    </Router>
  )
}

export default App
