import React from 'react'
import AppState from '../model/AppState'

const AppContext = React.createContext<Partial<AppState>>({})

export default AppContext
