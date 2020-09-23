import UIState from './UIState'
import CyReference from './CyReference'
import { SelectionState } from '../reducer/selectionReducer'
import NdexCredential from './NdexCredential'
import AppConfig from './AppConfig'


type AppState = {
  config: AppConfig
  
  selection: SelectionState
  dispatch: any
  
  cyReference: CyReference
  cyDispatch: any
  
  uiState: UIState
  setUIState: Function
  
  style: object
  setStyle: Function
  
  query: string
  setQuery: Function
  queryMode: string
  setQueryMode: Function
  queryResult: object
  setQueryResult: Function

  ndexCredential: NdexCredential
  setNdexCredential: Function
}

export default AppState
