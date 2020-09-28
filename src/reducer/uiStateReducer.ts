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
  showPropPanel: false,
  pointerPosition: {
    x: 0,
    y: 0,
  },
  lastSelectWasNode: false,
  leftPanelWidth: 0,
}

const uiStateReducer = (state: UIState, action: UIStateAction): UIState => {
  switch (action.type) {
    case UIStateActions.SET_DATA_PANEL_OPEN:
      return { ...state, dataPanelOpen: action.uiState.dataPanelOpen }
    case UIStateActions.SET_SHOW_SEARCH_RESULT:
      return { ...state, showSearchResult: action.uiState.showSearchResult, showPropPanel: false }
    case UIStateActions.SET_LEFT_PANEL_WIDTH:
      return { ...state, leftPanelWidth: action.uiState.leftPanelWidth }
    case UIStateActions.SET_SHOW_PROP_PANEL_TRUE:
      return { ...state, showPropPanel: true, pointerPosition: action.uiState.pointerPosition }
    case UIStateActions.SET_SHOW_PROP_PANEL_FALSE:
      return { ...state, showPropPanel: false }
    default:
      throw new Error('Invalid action')
  }
}

export default uiStateReducer
