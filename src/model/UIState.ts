/**
 * 
 * Main UI states: show / hide panels, etc.
 * 
 */
type UIState = {
  dataPanelOpen: boolean
  showSearchResult: boolean
  rightPanelWidth: number
  mainNetworkNotDisplayed: boolean
  activeTab: number

  // Search result pane will be maximized if this is true
  maximizeResultView: boolean
}

export default UIState
