/**
 * Each list contains selected object IDs (string)
 */
export type Selected = {
  nodes: string[]
  edges: string[]
}

export type Coordinates = {
  x: number
  y: number
}

export type LastSelected = {
  isNode: boolean
  fromMain: boolean
  id: number
  coordinates: Coordinates
  showPropPanel: boolean
}

export type SelectionState = {
  main: Selected
  sub: Selected
  lastSelected: LastSelected
}

export const EMPTY_SELECTION: SelectionState = {
  main: {
    nodes: [],
    edges: [],
  },
  sub: {
    nodes: [],
    edges: [],
  },
  lastSelected: {
    isNode: null,
    fromMain: null,
    id: null,
    coordinates: {
      x: 0,
      y: 0,
    },
    showPropPanel: false,
  },
}

export type SelectionAction = {
  type: string
  selectionState: SelectionState
}

export const SelectionActions = {
  CLEAR_ALL_MAIN: 'clearAllMain',
  CLEAR_ALL_SUB: 'clearAllSub',
  SET_MAIN_NODES_AND_EDGES: 'setMain',
  SET_SUB_NODES_AND_EDGES: 'setSub',
  CLOSE_PROP_PANEL: 'closePropPanel',
}

const selectionStateReducer = (state: SelectionState, action: SelectionAction): SelectionState => {
  switch (action.type) {
    case SelectionActions.SET_MAIN_NODES_AND_EDGES:
      return { ...state, main: action.selectionState.main, lastSelected: action.selectionState.lastSelected }
    case SelectionActions.SET_SUB_NODES_AND_EDGES:
      return { ...state, sub: action.selectionState.sub, lastSelected: action.selectionState.lastSelected }
    case SelectionActions.CLEAR_ALL_MAIN:
      return { ...state, main: { nodes: [], edges: [] }, lastSelected: { ...state.lastSelected, showPropPanel: false } }
    case SelectionActions.CLEAR_ALL_SUB:
      return { ...state, sub: { nodes: [], edges: [] }, lastSelected: { ...state.lastSelected, showPropPanel: false } }
    case SelectionActions.CLOSE_PROP_PANEL:
      return { ...state, lastSelected: { ...state.lastSelected, showPropPanel: false } }
    default:
      throw new Error('Invalid action')
  }
}

export default selectionStateReducer
