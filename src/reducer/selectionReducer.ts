/**
 * Each list contains selected object IDs (string)
 */
export type Selected = {
  nodes: string[]
  edges: string[]
}

export type SelectionState = {
  main: Selected
  sub: Selected
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
}

export type SelectionAction = {
  type: string
  selected: string[]
}

export const SelectionActions = {
  SET_MAIN_NODES: 'setMainNodes',
  SET_MAIN_NODES_CLEAR_EDGES: 'setMainNodesClearEdges',
  SET_MAIN_EDGES: 'setMainEdges',
  SET_MAIN_EDGES_CLEAR_NODES: 'setMainEdgesClearNodes',
  SET_SUB_NODES: 'setSubNodes',
  SET_SUB_EDGES: 'setSubEdges',
  CLEAR_ALL: 'clearAll',
}

const selectionReducer = (state: SelectionState, action: SelectionAction): SelectionState => {
  switch (action.type) {
    case SelectionActions.SET_MAIN_NODES:
      return { ...state, main: { nodes: action.selected, edges: state.main.edges } }
    case SelectionActions.SET_MAIN_NODES_CLEAR_EDGES:
      return { ...state, main: { nodes: action.selected, edges: [] } }
    case SelectionActions.SET_MAIN_EDGES:
      return { ...state, main: { edges: action.selected, nodes: state.main.nodes } }
    case SelectionActions.SET_MAIN_EDGES_CLEAR_NODES:
      return { ...state, main: { edges: action.selected, nodes: [] } }
    case SelectionActions.SET_SUB_NODES:
      return { ...state, sub: { nodes: action.selected, edges: state.main.edges } }
    case SelectionActions.SET_SUB_EDGES:
      return { ...state, sub: { edges: action.selected, nodes: state.main.nodes } }
    case SelectionActions.CLEAR_ALL:
      return EMPTY_SELECTION
    default:
      console.log(action.type)
  }
}

export default selectionReducer
