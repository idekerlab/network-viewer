import React, { useState, createContext } from 'react'
import AppState from '../model/AppState';


const AppContext = 
  React.createContext<Partial<AppState>>({});

// Create a provider for components to consume and subscribe to changes
// export const AppContextProvider = (props) => {
//   const [count, setCount] = useState(0)

//   return <AppContext.Provider value={[count, setCount]}>{props.children}</AppContext.Provider>
// }

export default AppContext