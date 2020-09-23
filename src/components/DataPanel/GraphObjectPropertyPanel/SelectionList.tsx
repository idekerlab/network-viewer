import React, { useContext, useEffect, useState } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import useSearch from '../../../hooks/useSearch'
import AppContext from '../../../context/AppState'
import EntryTable from './EntryTable'
import { AutoSizer } from 'react-virtualized'
import SplitPane from 'react-split-pane'

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
  const classes = useStyles()
  const { attributes } = props
  const { uuid, query, queryMode, setSelectedNodeAttributes, selectedNodeAttributes, selection } = useContext(
    AppContext,
  )
  const { status, data, error, isFetching } = useSearch(uuid, query, '', queryMode)

  useEffect(() => {
    if (data === null || data === undefined) {
      return
    }
    console.log('######### New data', data)
    const kvMap = data['kvMap']
    setSelectedNodeAttributes(kvMap)
  }, [data])

  let nodes = []
  let edges = []
  let nodeCount
  let edgeCount
  if (selection.lastSelected.from === 'main') {
    nodes = selection.main.nodes
    edges = selection.main.edges
  } else {
    nodes = selection.sub.nodes
    edges = selection.sub.edges
  }
  nodeCount = nodes.length
  edgeCount = edges.length

  console.log(selection)

  return (
    <AutoSizer disableWidth>
      {({ height, width }) => (
        <SplitPane split="horizontal" defaultSize={height / 2}>
          <EntryTable
            key={'selected-nodes'}
            label={`Selected Nodes (${nodeCount})`}
            selectedObjects={nodes}
            attributes={attributes.nodeAttr}
          />

          <EntryTable
            key={'selected-edges'}
            label={`Selected Edges (${edgeCount})`}
            selectedObjects={edges}
            attributes={attributes.edgeAttr}
          />
        </SplitPane>
      )}
    </AutoSizer>
  )
}

export default SelectionList
