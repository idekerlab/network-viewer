import React, {useState} from 'react'
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
  const [selectedNodes, setSelectedNodes] = useState([])
  const [selectedEdges, setSelectedEdges] = useState([])
  

const defState: AppState = {
  network: {},
  style,
  setStyle,
  selectedNodes,
  setSelectedNodes,
  selectedEdges,
  setSelectedEdges,
  summary,
  setSummary,
  uuid,
  setUuid,
  cx,
  setCx,

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
