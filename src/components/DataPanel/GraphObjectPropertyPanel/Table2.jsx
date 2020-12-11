/*
Same as Table.jsx. Done this way to force the table to completely reload instead
of trying to refresh, which doesn't work.
Sorry.
*/

import React, { useState, useEffect } from 'react'
import { DynamicSizeList } from 'react-window'
import { useTable, useBlockLayout } from 'react-table'
import { AutoSizer } from 'react-virtualized'
import { createStyles, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) =>
  createStyles({
    table: {
      display: 'flex',
      flexFlow: 'column',
      height: '100%',
      overflowX: 'auto',
      width: '100%',
    },
    header: {
      flex: '0 1 auto',
      width: '100%',
      background: theme.palette.secondary.main,
      lineHeight: 1.5,
    },
    content: {
      flex: '1 1 auto',
    },
    headerRow: {
      backgroundColor: theme.palette.secondary.main,
      display: 'flex',
      alignItems: 'center',
    },
    tableHeaderCell: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.common.white,
      fontSize: '0.875rem',
      padding: '6px',
      paddingRight: '12px',
    },
    tableBodyCell: {
      fontSize: '1em',
      padding: '6px',
      paddingRight: '12px',
      maxHeight: '12em',
      overflowY: 'auto',
    },
    tableRow: {
      '&:nth-of-type(odd)': {
        backgroundColor: 'rgb(240, 240, 240)',
      },

      borderBottom: '1px solid rgb(225, 225, 225)',
      borderCollapse: 'collapse',
    },
    fullWidth: {
      minWidth: '100%',
    },
  }),
)

function Table({ columns, data }) {
  const classes = useStyles()
  const scrollBarWidth = 15
  const [state, setState] = useState(true)

  useEffect(() => {
    setState(!state)
  }, [columns, data])
  // Use the state and functions returned from useTable to build your UI

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 10,
    }),
    [],
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, totalColumnsWidth, prepareRow } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useBlockLayout,
  )

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      style.wordWrap = 'break-word'

      const row = rows[index]
      prepareRow(row)
      return (
        <div
          {...row.getRowProps({
            style,
          })}
          className={'tr ' + classes.tableRow}
        >
          {row.cells.map((cell) => {
            return (
              <div {...cell.getCellProps()} className={'td ' + classes.tableBodyCell}>
                {cell.render('Cell')}
              </div>
            )
          })}
        </div>
      )
    },
    [prepareRow, rows],
  )

  // Render the UI for your table
  return (
    <div {...getTableProps()} className={classes.table}>
      <div className={classes.header}>
        {headerGroups.map((headerGroup) => (
          <div
            {...headerGroup.getHeaderGroupProps()}
            className={'tr ' + classes.headerRow}
            style={{ width: totalColumnsWidth + scrollBarWidth }}
          >
            {headerGroup.headers.map((column) => (
              <div {...column.getHeaderProps()} className={'th ' + classes.tableHeaderCell}>
                {column.render('Header')}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div {...getTableBodyProps()} className={classes.content}>
        <AutoSizer className={classes.fullWidth}>
          {({ height, width }) => (
            <DynamicSizeList
              height={height}
              itemCount={rows.length}
              width={totalColumnsWidth + scrollBarWidth > width ? totalColumnsWidth + scrollBarWidth : width}
            >
              {RenderRow}
            </DynamicSizeList>
          )}
        </AutoSizer>
      </div>
    </div>
  )
}

export default Table
