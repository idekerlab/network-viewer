import React, { VFC, useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import {
  useTable,
  useBlockLayout,
  usePagination,
  useSortBy,
  useFilters,
  useGlobalFilter,
} from 'react-table'
import { FixedSizeList } from 'react-window'
import theme from '../../../theme'

import {
  Grid,
  ScrollSync,
  AutoSizer,
  CellMeasurerCache,
  CellMeasurer,
} from 'react-virtualized'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

const scrollbarWidth = () => {
  const scrollDiv = document.createElement('div')
  scrollDiv.setAttribute(
    'style',
    'width: 100px; height: 100px; overflow: scroll; position:absolute; top:-9999px;',
  )
  document.body.appendChild(scrollDiv)
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
  document.body.removeChild(scrollDiv)
  return scrollbarWidth
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      width: '100%',
      height: '100%',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      background: theme.palette.background.paper,
      boxSizing: 'border-box',
      color: '#333333',
      border: '4px solid red',
    },
    tablePanel: {
      flexGrow: 1,
      border: '5px solid green',
      background: '#AAA',
    },
    header: {
      border: '4px solid pink',
      height: '3em',
    },
    wrapper: { flex: '1 1 auto', background: 'blue', height: '100%' },
    pagination: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      background: theme.palette.background.paper,
      height: '3em',
      padding: theme.spacing(1),
      // borderTop: `1px solid ${theme.palette.divider}`,
      border: '3px solid blue',
    },
    buttons: {
      // marginRight: theme.spacing(1)
    },
    button: {
      marginRight: theme.spacing(1),
    },
    topBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingRight: theme.spacing(1),
    },
    title: {
      paddingTop: theme.spacing(1),
      paddingLeft: theme.spacing(3),
    },
    tabs: {
      boxSizing: 'border-box',
      backgroundColor: theme.palette.background.paper,
      margin: 0,
      padding: 0,
      height: '100%',
      width: '100%',
    },
    tab: {
      // minHeight: '2.6em',
      // minWidth: '7em',
      '&:disabled': {
        color: '#AAAAAA',
      },
    },
    tabPanel: {
      width: '100%',
      height: '100%',
    },
    collapsiblePanel: {
      minHeight: 'auto',
    },

    gridRow: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
    },
    gridColumn: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1 auto',
    },
    leftSideGridContainer: {
      flex: '0 0 75px',
      zIndex: 10,
      background: '#FFFFFF',
      borderRight: `1px solid ${theme.palette.divider}`,
    },
    leftSideGrid: {
      overflow: 'hidden !important',
    },
    headerGrid: {
      width: '100%',
      overflow: 'hidden !important',
      background: 'red',
      // background: theme.palette.background.paper,
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    bodyGrid: {
      width: '100%',
    },

    evenRow: {},
    oddRow: {
      // background-color: rgba(0, 0, 0, .1);
    },

    cell: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '0 .5em',
    },
    headerCell: {
      fontWeight: 'bold',
    },
  })
})

// @ts-ignore
const VirtualizedTable3: VFC<{
  columns: any[]
  data: any
  parentSize: [number, number]
}> = ({ columns, data, parentSize }) => {
  const _cache = new CellMeasurerCache({
    defaultWidth: 250,
    fixedWidth: true,
  })
  const pagenationRef = useRef(null)

  const headerRef = useRef(null)
  const [headerHeight, setHeaderHeight] = useState(1)
  const [pageHeight, setPageHeight] = useState(1)

  const classes = useStyles()

  const defaultColumn = React.useMemo(
    () => ({
      width: 150,
    }),
    [],
  )

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight)
    }
  }, [headerRef])

  useEffect(() => {
    if (pagenationRef.current) {
      setPageHeight(pagenationRef.current.offsetHeight)
    }
  }, [pagenationRef])
  const scrollBarSize = React.useMemo(() => scrollbarWidth(), [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: {
        pageIndex: 0,
        pageSize: 1000,
      },
    },
    useSortBy,
    usePagination,
    useBlockLayout,
  )

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = page[index]
      prepareRow(row)
      return (
        <div
          {...row.getRowProps({
            style,
          })}
          className="tr"
        >
          {row.cells.map((cell) => {
            return (
              <div {...cell.getCellProps()} className="td">
                {cell.render('Cell')}
              </div>
            )
          })}
        </div>
      )
    },
    [prepareRow, page],
  )

  const _renderBodyCell = ({ columnIndex, key, rowIndex, style }) => {
    if (rowIndex < 1) {
      return _renderLeftHeaderCell({ columnIndex, key, style })
    }
    return _renderLeftSideCell({ columnIndex, key, rowIndex, style })
  }

  const _renderHeaderCell = ({ columnIndex, key, rowIndex, style }) => {
    if (columnIndex < 1) {
      return
    }

    return _renderLeftHeaderCell({ columnIndex, key, style })
  }

  const _handleSort = (index: number) => {
    console.log('EVT', index)
  }
  // Render a cell in the column header.
  const _renderLeftHeaderCell = ({ columnIndex, key, style }) => {
    const column = headerGroups[0].headers[columnIndex]
    const cprops = { ...column.getHeaderProps(column.getSortByToggleProps()) }

    return (
      <div key={key} style={{...style, width: column.width}} onClick={cprops['onClick']}>
        {column.Header}
      </div>
    )
  }

  const _renderLeftSideCell = ({ columnIndex, key, rowIndex, style }) => {
    const row = page[rowIndex]
    prepareRow(row)

    const cells = row.cells.map((cell) => cell)
    const cell = [cells[columnIndex]]
    return (
        <div key={key} style={style}>
          {cell[0].render('Cell')}
        </div>
    )
  }

  const columnWidth = 225
  const columnCount = columns.length
  const overscanColumnCount = 0
  const overscanRowCount = 5
  const rowHeight = 40
  const rowCount = page.length

  return (
    <div className={classes.root}>
      <div className={classes.tablePanel}>
        <AutoSizer>
          {({ height, width }) => (
            <Grid
              className={classes.bodyGrid}
              columnWidth={columnWidth}
              columnCount={columnCount}
              height={height}
              //     onScroll={onScroll}
              overscanColumnCount={overscanColumnCount}
              overscanRowCount={overscanRowCount}
              cellRenderer={_renderBodyCell}
              rowHeight={rowHeight}
              rowCount={rowCount}
              width={width}
            />
          )}
        </AutoSizer>
      </div>

      <div className={classes.pagination}>
        <div className={classes.buttons}>
          <button
            className={classes.button}
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            {'<<'}
          </button>
          <button
            className={classes.button}
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            {'<'}
          </button>
          <button
            className={classes.button}
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            {'>'}
          </button>
          <button
            className={classes.button}
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {'>>'}
          </button>
        </div>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[100, 1000, 5000, 10000].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
        per page
      </div>
    </div>
  )
}

export default VirtualizedTable3
