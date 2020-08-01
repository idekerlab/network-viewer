import React, { useContext, useEffect, useState } from 'react'
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles'

import ListSubheader from '@material-ui/core/ListSubheader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import useSearch from '../../../hooks/useSearch'
import AppContext from '../../../context/AppState'
import SelectedItems from './SelectedItems'
import NoSelectionListItem, { NoSelectionProps } from './NoSelectionListItem'

import VirtualizedDataTable from './VirtualizedDataTable'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      overflowY: 'auto',
      backgroundColor: theme.palette.background.paper,
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

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 12,
    },
  }),
)(TableCell)
const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow)

const SelectionList = (props) => {
  const t0 = performance.now()
  console.log('* List start')
  const classes = useStyles()

  const { attributes, selectedNodes, selectedEdges } = props

  const appContext = useContext(AppContext)
  const { uuid, query, queryMode, setSelectedNodeAttributes, selectedNodeAttributes } = appContext

  const [open, setOpen] = useState(true)

  const { status, data, error, isFetching } = useSearch(uuid, query, '', queryMode)

  useEffect(() => {
    if (data === null || data === undefined) {
      return
    }

    console.log('######### New data effect', data)
    const { nodeIds, kvMap } = data
    // setSelectedNodes(nodeIds)
    setSelectedNodeAttributes(kvMap)
  }, [data])

  const handleClick = () => {
    setOpen(!open)
  }

  const nodeCount = selectedNodes.length
  const edgeCount = selectedEdges.length

  console.log('######### New Selection', performance.now() - t0, selectedNodes, selectedEdges)
  return (
    <div className={classes.root}>
      {nodeCount ? (
        <SelectedItems
          key={'selected-nodes'}
          label={`Nodes (${nodeCount})`}
          selectedObjects={selectedNodes}
          avatarLetter={'N'}
          attributes={attributes.nodeAttr}
        />
      ) : (
        <NoSelectionListItem avatarLetter={'N'} objType={'Nodes'} avatarColor={'red'} />
      )}
      {edgeCount ? (
        <SelectedItems
          key={'selected-edges'}
          label={`Edges (${edgeCount + 1})`}
          selectedObjects={selectedEdges}
          avatarLetter={'E'}
          attributes={attributes.edgeAttr}
        />
      ) : (
        <NoSelectionListItem avatarLetter={'E'} objType={'Edges'} avatarColor={'red'} />
      )}
    </div>
  )
}

export default SelectionList
