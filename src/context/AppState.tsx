import React, { useState, createContext } from 'react'
import AppState from '../model/AppState';


const AppContext = 
  React.createContext<Partial<AppState>>({});

export default AppContext