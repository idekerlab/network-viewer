import React, { useContext, useEffect, useMemo } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import useSearch from '../../../hooks/useSearch'
import AppContext from '../../../context/AppState'
import EntryTable from './EntryTable'
import { AutoSizer } from 'react-virtualized'
import SplitPane from 'react-split-pane'
import { useParams } from 'react-router-dom'
import { getContextFromCx } from '../../../utils/contextUtil'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.palette.background.paper,
      display: 'grid',
      boxSizing: 'border-box',
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    table: {},
  }),
)

const SelectionList = (props) => {
  const { uuid } = useParams()
  const { attributes, cx } = props
  const { query, queryMode, selectionState, ndexCredential, config } = useContext(AppContext)
  const { data } = useSearch(uuid, query, config.ndexHttps, ndexCredential, queryMode)

  useEffect(() => {
    if (data === null || data === undefined) {
      return
    }
    const kvMap = data['kvMap']
  }, [data])

  const context = useMemo(() => getContextFromCx(cx), [cx])

  let nodes = []
  let edges = []
  let nodeCount
  let edgeCount
  if (selectionState.lastSelected.fromMain) {
    nodes = selectionState.main['nodes']
    edges = selectionState.main['edges']
  } else {
    nodes = selectionState.sub['nodes']
    edges = selectionState.sub['edges']
  }
  nodeCount = nodes.length
  edgeCount = edges.length

  return (
    <AutoSizer disableWidth>
      {({ height, width }) => (
        <SplitPane split="horizontal" defaultSize={height / 2}>
          <EntryTable
            key={'selected-nodes'}
            label={`Selected Nodes (${nodeCount})`}
            selectedObjects={nodes}
            attributes={attributes.nodeAttr}
            context={context}
          />

          <EntryTable
            key={'selected-edges'}
            label={`Selected Edges (${edgeCount})`}
            selectedObjects={edges}
            attributes={attributes.edgeAttr}
            type={'edge'}
            context={context}
          />
        </SplitPane>
      )}
    </AutoSizer>
  )
}

export default SelectionList
