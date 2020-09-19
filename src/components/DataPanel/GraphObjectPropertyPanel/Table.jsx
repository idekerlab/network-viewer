import React from 'react'
import { DynamicSizeList } from 'react-window'
import { useTable, useBlockLayout, useResizeColumns } from 'react-table'
import { AutoSizer } from 'react-virtualized'
import { createStyles, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) =>
  createStyles({
    table: {
      display: 'flex',
      flexFlow: 'column',
      height: '100%',
      overflowX: 'auto',
    },
    header: {
      flex: '0 1 auto',
    },
    content: {
      flex: '1 1 auto',
    },
    tableHeaderCell: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.common.white,
      fontSize: '0.875rem',
      padding: '6px 24px 6px 16px',
    },
    tableBodyCell: {
      fontSize: '1em',
      padding: '6px 24px 6px 16px',
    },
    tableRow: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)

function Table({ columns, data, height }) {
  const classes = useStyles()

  // Use the state and functions returned from useTable to build your UI

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400,
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
    useResizeColumns,
  )

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      style = {
        width: '100%',
        wordWrap: 'break-word',
      }

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
          <div {...headerGroup.getHeaderGroupProps()} className="tr">
            {headerGroup.headers.map((column) => (
              <div {...column.getHeaderProps()} className={'th ' + classes.tableHeaderCell}>
                {column.render('Header')}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div {...getTableBodyProps()} className={classes.content}>
        <AutoSizer disableWidth>
          {({ height, width }) => (
            <DynamicSizeList height={height} itemCount={rows.length} width={totalColumnsWidth}>
              {RenderRow}
            </DynamicSizeList>
          )}
        </AutoSizer>
      </div>
    </div>
  )
}

export default Table
