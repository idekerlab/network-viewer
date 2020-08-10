import React, { useContext, useEffect, useState } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import useSearch from '../../../hooks/useSearch'
import AppContext from '../../../context/AppState'
import EntryTable from './EntryTable'

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
    nodes: {
      backgroundColor: theme.palette.secondary.main,
    },
    edges: {
      backgroundColor: theme.palette.secondary.main,
    },
    card: {
      padding: '0.5em',
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
    const { kvMap } = data
    setSelectedNodeAttributes(kvMap)
  }, [data])

  const nodeCount = selection.main.nodes.length
  const edgeCount = selection.main.edges.length

  return (
    <div className={classes.root}>
      <EntryTable
        key={'selected-nodes'}
        label={`Selected Nodes (${nodeCount})`}
        selectedObjects={selection.main.nodes}
        attributes={attributes.nodeAttr}
      />

      <EntryTable
        key={'selected-edges'}
        label={`Selected Edges (${edgeCount})`}
        selectedObjects={selection.main.edges}
        attributes={attributes.edgeAttr}
      />
    </div>
  )
}

export default SelectionList
