import UIState from './UIState'
import CyReference from './CyReference'
import SelectionState from './SelectionState'
import NdexCredential from './NdexCredential'
import AppConfig from './AppConfig'
import Summary from './Summary'
import Keycloak from 'keycloak-js'

type AppState = {
  config: AppConfig

  cyReference: CyReference
  cyDispatch: any

  // TODO: create better type
  lgrReference: unknown
  setLgrReference: Function

  uiState: UIState
  uiStateDispatch: any

  query: string
  setQuery: Function
  queryMode: string
  setQueryMode: Function

  summary: Summary
  setSummary: (summary: Summary) => void

  selectionState: SelectionState
  selectionStateDispatch: any

  keycloak: Keycloak

  ndexCredential: NdexCredential
  setNdexCredential: (credential: NdexCredential) => void

  isReady: boolean
  setIsReady: (isReady: boolean) => void
}

export default AppState
