import UIState from '../model/UIState'

export type UIStateAction = {
  type: string
  uiState: any
}

export const UIStateActions = {
  SET_DATA_PANEL_OPEN: 'setDataPanelOpen',
  SET_SHOW_SEARCH_RESULT: 'setShowSearchResult',
  SET_LEFT_PANEL_WIDTH: 'setLeftPanelWidth',
  SET_SHOW_PROP_PANEL_TRUE: 'setShowPropPanelTrue',
  SET_SHOW_PROP_PANEL_FALSE: 'setShowPropPanelFalse',
}

export const INITIAL_UI_STATE: UIState = {
  dataPanelOpen: true,
  showSearchResult: false,
  leftPanelWidth: 0,
}

const uiStateReducer = (state: UIState, action: UIStateAction): UIState => {
  switch (action.type) {
    case UIStateActions.SET_DATA_PANEL_OPEN:
      return { ...state, dataPanelOpen: action.uiState.dataPanelOpen }
    case UIStateActions.SET_SHOW_SEARCH_RESULT:
      return { ...state, showSearchResult: action.uiState.showSearchResult }
    case UIStateActions.SET_LEFT_PANEL_WIDTH:
      return { ...state, leftPanelWidth: action.uiState.leftPanelWidth }
    default:
      throw new Error('Invalid action')
  }
}

export default uiStateReducer
