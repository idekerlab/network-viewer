import CyReference from '../model/CyReference'

export type CyAction = {
  type: string
  cyReference: any
}

export const CyActions = {
  SET_MAIN: 'setMain',
  SET_SUB: 'setSub',
}

export const INITIAL_CY_REFERENCE: CyReference = {
  main: null,
  sub: null
}

const cyReducer = (state: CyReference, action: CyAction): CyReference => {
  switch (action.type) {
    case CyActions.SET_MAIN:
      return { ...state, main: action.cyReference }
    case CyActions.SET_SUB:
      return { ...state, sub: action.cyReference }
    default:
      throw new Error('Invalid action')
  }
}

export default cyReducer
