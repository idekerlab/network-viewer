import SelectionState from '../../../../model/SelectionState'
import { getEntry } from '../../../../utils/cxUtil'
import QueryState, { DB_URL } from './QueryState'
import TargetNodes from './TargetNodes'


const getColumnNames = (cx: any[]): string[] => {
  const nodeAttr = getEntry('nodeAttributes', cx)

  const columnNames = new Set<string>()

  let len = nodeAttr.length
  while (len--) {
    columnNames.add(nodeAttr[len]['n'])
  }
  // Insert name to the front
  return ['name', ...Array.from(columnNames).sort()]
}

const buildUrl = (
  queryState: QueryState,
  attributes: any[],
  selectionState: SelectionState,
  cx: any[] // Contains sub network if available
): string => {
  const selectedColumn = queryState.column
  const {db, target} = queryState
  let attrValues = new Set()

  
  if(target === TargetNodes.All) {
    // All nodes in main network
    const attrVals = Object.values(attributes)
    attrVals.forEach(entry => {
      attrValues.add(entry.get(selectedColumn))
    })   
  } else if(target === TargetNodes.Selected) {
    // Selected nodes in main network
    const selectedNodes = selectionState.main['nodes']
    selectedNodes.forEach(node => {
      attrValues.add(attributes[node].get(selectedColumn))
    });
  } else if(target === TargetNodes.AllResult) {
    // All nodes in the query result
    const nodes = getEntry('nodes', cx)
    const nodeIds = nodes.map(node=>node['@id'])
    nodeIds.forEach(node => {
      attrValues.add(attributes[node].get(selectedColumn))
    });

    console.log(nodes, nodeIds)

  } else {
    // Selected nodes in the query result
    const selectedNodes = selectionState.sub['nodes']
    selectedNodes.forEach(node => {
      attrValues.add(attributes[node].get(selectedColumn))
    });

    console.log(selectedNodes)
  }
  const queryString = Array.from(attrValues).sort().join(',')
  const baseUrl = DB_URL[db.toString()]
  return `${baseUrl}${queryString}`
}


export { buildUrl, getColumnNames }
