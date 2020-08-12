import React from 'react'
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import VirtualizedDataTable from './VirtualizedDataTable'

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.common.white,
      fontSize: '1.3em',
      fontWeight: 500,
    },
    body: {
      fontSize: '0.8em',
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

const useStyles = makeStyles({
  table: {
    marginTop: '1em',
  },
  container: {
    margin: '0.5em',
  },
})

const EntryTable = (props) => {
  const { selectedObjects, attributes, label } = props
  if (attributes === undefined) {
    return <div />
  }

  const getDataArray = (ids, attributes) => {

    const data = []
    let len = ids.length

    while(len--) {
      const id = ids[len]
      const attr = attributes[id]
      if(attr == undefined) {

        continue
      }
      let name = attr.get('name')
      if(name === undefined) {
        name = id
      }
      const keys =[...attr.keys()]
      let idx = keys.length

      while(idx--) {
        const row = {}
        const key = keys[idx]
        row['id'] = name
        row['propName'] = key
        row['value'] = attr.get(key)
        data.push(row)
      }
    }
    return data
  }

  const dataRows = getDataArray(selectedObjects, attributes)

  return (
    <VirtualizedDataTable label={label} data={dataRows} />
  )
}

export default EntryTable
