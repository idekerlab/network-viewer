type AppState = {
  uuid: string,
  setUuid: Function,
  network: object,
  style: object,
  setStyle: Function,
  selectedNodes: object[],
  setSelectedNodes: Function,
  selectedNodeAttributes: object,
  setSelectedNodeAttributes: Function,
  selectedEdges: object[],
  setSelectedEdges: Function,
  summary: object,
  setSummary: Function,
  cx: object[],
  setCx: Function,
  cy: any | null,
  setCy: Function,
  query: string,
  setQuery: Function,
  queryMode: string,
  setQueryMode: Function
}

export default AppState