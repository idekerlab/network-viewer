import React, { useState } from 'react'
import './App.css'
import { useHistory } from 'react-router-dom'
import { Switch, Route, BrowserRouter } from 'react-router-dom'

import BasePanel from './components/BasePanel'

import AppContext from './context/AppState'
import AppState from './model/AppState'
import TopPanel from './components/TopPanel'

const App = () => {
  const history = useHistory()
  const [uuid, setUuid] = useState('')
  const [cx, setCx] = useState([])
  const [cy, setCy] = useState(null)
  const [cySub, setCySub] = useState(null)
  const [summary, setSummary] = useState({})
  const [style, setStyle] = useState({})
  const [query, setQuery] = useState('')
  const [queryMode, setQueryMode] = useState('direct')
  const [queryResult, setQueryResult] = useState(null)
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
    cy,
    setCy,
    cySub,
    setCySub,
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
            <BasePanel />
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
