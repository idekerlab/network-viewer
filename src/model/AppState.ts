import UIState from './UIState'
import CyReference from './CyReference'
import { SelectionState } from '../reducer/selectionReducer'

type AppState = {
  selection: SelectionState
  dispatch: any
  
  uiState: UIState
  setUIState: Function
  
  uuid: string
  setUuid: Function
  style: object
  setStyle: Function
  
  selectedNodeAttributes: object
  setSelectedNodeAttributes: Function
  
  summary: object
  setSummary: Function

  cyReference: CyReference
  setCyReference: Function

  query: string
  setQuery: Function
  queryMode: string
  setQueryMode: Function
  queryResult: object
  setQueryResult: Function
}

export default AppState
