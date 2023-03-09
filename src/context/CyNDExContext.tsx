import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  VFC,
  Dispatch,
} from 'react'

import ndexClient from '@js4cytoscape/ndex-client'

// There are only two action types for this: Cytoscape is available or not.
type CyNdexActionType = 'setAvailable' | 'setUnavailable'

interface CyNdexAction {
  type: CyNdexActionType
  payload: any
}

interface CyNdexState {
  available: boolean
  port: number
  status: any
}

const DEFAULT_STATE: CyNdexState = {
  available: false,
  port: 1234,
  status: undefined,
}

export const CyNDExContext = createContext<{
  state: CyNdexState
  dispatch: Dispatch<CyNdexAction>
}>({ state: DEFAULT_STATE, dispatch: () => {} })

export const CyNDExProvider: VFC<{ port: number; children: any }> = ({
  port,
  children,
}) => {
  const initialState: CyNdexState = {
    available: false,
    status: undefined,
    port,
  }

  const [state, dispatch] = useReducer(
    (state: CyNdexState, action: CyNdexAction) => {
      switch (action.type) {
        case 'setAvailable':
          return {
            ...state,
            available: true,
            status: action.payload,
          }
        case 'setUnavailable':
          return {
            ...state,
            available: false,
            status: undefined,
          }
        default:
          throw new Error()
      }
    },
    initialState
  )

  let pollCyREST = false

  function refresh() {
    const cyndex = new ndexClient.CyNDEx(port)

    if (pollCyREST) {
      cyndex.getCyNDExStatus().then(
        (response) => {
          dispatch({
            type: 'setAvailable',
            payload: response.data,
          })
        },
        (err) => {
          dispatch({ type: 'setUnavailable', payload: err })
        }
      )
      setTimeout(refresh, 5000)
    }
  }

  const pollingStart = () => {
    pollCyREST = true
    setTimeout(refresh, 1000)
  }

  const pollingStop = () => {
    pollCyREST = false
  }

  useEffect(() => {
    pollingStart()

    return () => {
      pollingStop()
    }
  }, [])

  return (
    <CyNDExContext.Provider value={{ state, dispatch }}>
      {children}
    </CyNDExContext.Provider>
  )
}

export const useCyNDExValue = () => useContext(CyNDExContext)
