type AppState = {
  dataPanelOpen: boolean
  setDataPanelOpen: Function
  
  uuid: string
  setUuid: Function
  style: object
  setStyle: Function
  selectedNodes: string[]
  setSelectedNodes: Function
  selectedNodeAttributes: object
  setSelectedNodeAttributes: Function
  selectedEdges: string[]
  setSelectedEdges: Function
  summary: object
  setSummary: Function
  cx: object[]
  setCx: Function
  cy: any | null
  setCy: Function
  cySub: any | null
  setCySub: Function
  query: string
  setQuery: Function
  queryMode: string
  setQueryMode: Function
  queryResult: object
  setQueryResult: Function
}

export default AppState
