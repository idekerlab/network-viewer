type AppState = {
  uuid: string,
  setUuid: Function,
  network: object,
  style: object,
  setStyle: Function,
  selectedNodes: object[],
  setSelectedNodes: Function,
  selectedEdges: object[],
  setSelectedEdges: Function,
  summary: object,
  setSummary: Function,
  cx: object[],
  setCx: Function
}

export default AppState