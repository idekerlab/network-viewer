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
    },
    body: {
      fontSize: 14,
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
  table: {},
})

const DataTable = (props) => {
  const classes = useStyles()

  const { name, data } = props

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size={'small'} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>{name}</StyledTableCell>
            <StyledTableCell>Properties</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((entry) => (
            <StyledTableRow key={entry.predicateString}>
              <StyledTableCell component="th" scope="row">
                {entry.predicateString}
              </StyledTableCell>
              <StyledTableCell align="left">{entry.value}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DataTable
