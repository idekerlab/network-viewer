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

  ndexCredential: NdexCredential
  setNdexCredential: Function

  summary: Summary
  setSummary: Function

  selectionState: SelectionState
  selectionStateDispatch: any

  // This is a hack, but looks only way to open external component
  // (Sharing external component as state)
  ndexLoginWrapper: unknown
  setNdexLoginWrapper: (button: any) => void

  keycloak: Keycloak
  isReady: boolean
  setIsReady: (isReady: boolean) => void
}

export default AppState
