import React from 'react'
import { useTable, useExpanded } from 'react-table'
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  root: {
    padding: '1rem',
  },
  table: {
    borderSpacing: 0,
    border: '1px solid black',
  },
  tr: {
    borderBottom: 0,
  },
  td: {
    margin: 0,
    padding: '0.5rem',
    borderBottom: '1px solid black',
    borderRight: '1px solid black',
  },
})

const NestedTable = ({ columns: nodeColumns, data }) => {
  return <div />
  /*
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { expanded },
  } = useTable(
    {
      columns: nodeColumns,
      data,
    },
    useExpanded,
  )

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )*/
}

export default NestedTable
