import UIState from './UIState'
import CyReference from './CyReference'
import { SelectionState } from '../reducer/selectionReducer'
import NdexCredential from './NdexCredential'
import AppConfig from './AppConfig'
import Summary from './Summary'

type AppState = {
  config: AppConfig

  selection: SelectionState
  dispatch: any

  cyReference: CyReference
  cyDispatch: any

  uiState: UIState
  setUIState: Function

  query: string
  setQuery: Function
  queryMode: string
  setQueryMode: Function

  ndexCredential: NdexCredential
  setNdexCredential: Function

  summary: Summary
  setSummary: Function
}

export default AppState
