import UIState from '../model/UIState'

export type UIStateAction = {
  type: string
  uiState: any
}

export const UIStateActions = {
  SET_DATA_PANEL_OPEN: 'setDataPanelOpen',
  SET_SHOW_SEARCH_RESULT: 'setShowSearchResult',
  SET_RIGHT_PANEL_WIDTH: 'setRightPanelWidth',
  SET_SHOW_PROP_PANEL_TRUE: 'setShowPropPanelTrue',
  SET_SHOW_PROP_PANEL_FALSE: 'setShowPropPanelFalse',
  SET_MAIN_NETWORK_NOT_DISPLAYED: 'setMainNetworkNotDisplayed',
  SET_ACTIVE_TAB: 'setActiveTab',
}

export const INITIAL_UI_STATE: UIState = {
  dataPanelOpen: true,
  showSearchResult: false,
  rightPanelWidth: 0,
  mainNetworkNotDisplayed: false,
  activeTab: 0,
  maximizeResultView: false
}

const uiStateReducer = (state: UIState, action: UIStateAction): UIState => {
  switch (action.type) {
    case UIStateActions.SET_DATA_PANEL_OPEN:
      return { ...state, dataPanelOpen: action.uiState.dataPanelOpen }
    case UIStateActions.SET_SHOW_SEARCH_RESULT:
      return { ...state, showSearchResult: action.uiState.showSearchResult }
    case UIStateActions.SET_RIGHT_PANEL_WIDTH:
      return { ...state, rightPanelWidth: action.uiState.rightPanelWidth }
    case UIStateActions.SET_MAIN_NETWORK_NOT_DISPLAYED:
      return {
        ...state,
        mainNetworkNotDisplayed: action.uiState.mainNetworkNotDisplayed,
      }
    case UIStateActions.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.uiState.activeTab }
    default:
      throw new Error('Invalid action')
  }
}

export default uiStateReducer
