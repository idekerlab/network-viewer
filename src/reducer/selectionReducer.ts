/**
 * Each list contains selected object IDs (string)
 */
export type Selected = {
  nodes: string[]
  edges: string[]
}

export type LastSelected = {
  nodes: string[]
  edges: string[]
  from: string
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
    nodes: [],
    edges: [],
    from: '',
  },
}

export type SelectionAction = {
  type: string
  selected: string[]
  from: string
}

export const SelectionActions = {
  SET_MAIN_NODES: 'setMainNodes',
  SET_MAIN_EDGES: 'setMainEdges',
  SET_LAST_SELECTED_NODE: 'setLastSelectedNode',
  SET_LAST_SELECTED_EDGE: 'setLastSelectedEdge',
  SET_SUB_NODES: 'setSubNodes',
  SET_SUB_EDGES: 'setSubEdges',
  SET_LAST_SELECTED_FROM: 'setLastSelectedFrom',
  CLEAR_ALL: 'clearAll',
}

const selectionReducer = (state: SelectionState, action: SelectionAction): SelectionState => {
  switch (action.type) {
    case SelectionActions.SET_MAIN_NODES:
      return { ...state, main: { nodes: action.selected, edges: state.main.edges } }
    case SelectionActions.SET_MAIN_EDGES:
      return { ...state, main: { edges: action.selected, nodes: state.main.nodes } }
    case SelectionActions.SET_LAST_SELECTED_NODE:
      return { ...state, lastSelected: { nodes: action.selected, edges: [], from: action.from } }
    case SelectionActions.SET_LAST_SELECTED_EDGE:
      return { ...state, lastSelected: { nodes: [], edges: action.selected, from: action.from } }
    case SelectionActions.SET_SUB_NODES:
      return { ...state, sub: { nodes: action.selected, edges: state.sub.edges } }
    case SelectionActions.SET_SUB_EDGES:
      return { ...state, sub: { edges: action.selected, nodes: state.sub.nodes } }
    case SelectionActions.SET_LAST_SELECTED_FROM:
      return {
        ...state,
        lastSelected: { nodes: state.lastSelected.nodes, edges: state.lastSelected.edges, from: action.from },
      }
    case SelectionActions.CLEAR_ALL:
      return EMPTY_SELECTION
    default:
      console.log(action.type)
  }
}

export default selectionReducer
