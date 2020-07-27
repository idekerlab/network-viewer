import React from 'react'
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.common.white,
      fontSize: '1.3em',
      fontWeight: 500
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
    marginTop: '1em'
  },
  container: {
    margin: '0.5em'
  }
})

const EntryTable = (props) => {
  const classes = useStyles()
  const { attributes, title } = props

  // This is single entry
  const attrNames = [...attributes.keys()]

  return (
      <Table className={classes.table} size={'small'} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>{title}</StyledTableCell>
            <StyledTableCell></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attrNames.map((key) => (
            <StyledTableRow key={Math.random()}>
              <StyledTableCell component="th" scope="row">
                {key}
              </StyledTableCell>
              <StyledTableCell align="left">{attributes.get(key)}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
  )
}

export default EntryTable
