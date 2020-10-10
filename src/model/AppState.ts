import UIState from './UIState'
import CyReference from './CyReference'
import SelectionState from './SelectionState'
import NdexCredential from './NdexCredential'
import AppConfig from './AppConfig'
import Summary from './Summary'

type AppState = {
  config: AppConfig

  cyReference: CyReference
  cyDispatch: any

  uiState: UIState
  uiStateDispatch: any

  query: string
  setQuery: Function
  queryMode: string
  setQueryMode: Function

  ndexCredential: NdexCredential
  setNdexCredential: Function

  summary: Summary
  setSummary: Function

  selectionState: SelectionState
  selectionStateDispatch: any
}

export default AppState
