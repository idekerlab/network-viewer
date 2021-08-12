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
  CellMeasurer,
  CellMeasurerCache,
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
    // Base area covers the entire panel
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
    },

    // Area for virtualized table
    tablePanel: {
      flexGrow: 1,
      boxSizing: 'border-box',
      // border: '5px solid teal',
    },

    tableBody: {
      flexGrow: 1,
      boxSizing: 'border-box',
      // border: '3px solid red',
    },

    gridRow: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      height: '98%',
    },
    gridColumn: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1 auto',
      height: '98%',
      // width: '100%',
    },
    pagination: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      background: theme.palette.background.paper,
      height: '3em',
      padding: theme.spacing(1),
      border: theme.palette.divider,
    },
    buttons: {
      // marginRight: theme.spacing(1)
    },
    pageLabel: {
      width: '7em',
    },
    pageSelector: {
      width: '5em',
      marginRight: theme.spacing(1),
    },
    pageSelectorPanel: {
      width: '10em',
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

    leftSideGridContainer: {
      boxSizing: 'border-box',
      // border: '3px solid #FFaa88',
      // flex: '0 0 75px',
      zIndex: 10,
      background: '#FFFFFF',
      borderRight: `2px solid ${theme.palette.divider}`,
      height: '100%',
      fontWeight: 'bold',
    },
    leftSideGrid: {
      overflow: 'hidden !important',
    },
    headerGrid: {
      width: '100%',
      height: '100%',
      overflow: 'hidden !important',
      borderBottom: `1px solid ${theme.palette.divider}`,
      display: 'grid',
      fontSize: '1.2em',
      background: theme.palette.background.default,
      paddingLeft: '0.5em',
    },
    bodyGrid: {
      width: '100%',
      // boxSizing: 'border-box',
      // border: '3px solid #FF0088',
    },

    evenRow: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '0.5em',
      // borderBottom: `1px solid ${theme.palette.divider}`,
    },
    oddRow: {
      backgroundColor: 'rgba(150, 150, 150, .1)',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '0.5em',
      // borderBottom: `1px solid ${theme.palette.divider}`,
    },

    cell: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      // padding: '0 .5em',
      paddingLeft: '0.5em',
    },
    headerCell: {
      fontWeight: 'bold',
      color: 'blue',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '0.2em',
    },
  })
})

const cache = new CellMeasurerCache({
  defaultWidth: 220,
  fixedWidth: true,
})

// const dynamicCellRenderer = ({ columnIndex, key, parent, rowIndex, style }) => {
//   const row = page[rowIndex]
//     prepareRow(row)

//     const cells = row.cells.map((cell) => cell)
//     const cell = [cells[columnIndex]]

//     const cellClass = rowIndex % 2 === 0 ? classes.evenRow : classes.oddRow
//     return (
//       <div className={cellClass} key={key} style={style}>
//         {cell[0].render('Cell')}
//       </div>
//     )

//   return (
//     <CellMeasurer
//       cache={cache}
//       columnIndex={columnIndex}
//       key={key}
//       parent={parent}
//       rowIndex={rowIndex}
//     >
//       <div
//         style={{
//           ...style,
//           height: 35,
//           whiteSpace: 'nowrap'
//         }}
//       >
//         {content}
//       </div>
//     </CellMeasurer>
//   );
// }

// @ts-ignore
const VirtualizedTable2: VFC<{
  columns: any[]
  data: any
  parentSize: [number, number]
}> = ({ columns, data, parentSize }) => {
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
        pageSize: 100,
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

  const _renderBodyCell = ({ columnIndex, key, parent, rowIndex, style }) => {
    if (columnIndex < 1) {
      return
    }

    return _renderLeftSideCell({ columnIndex, key, parent, rowIndex, style })
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
      <div
        key={key}
        style={{
          ...style,
          display: 'grid',
          // justifyContent: '',
          alignContent: 'center',
        }}
        onClick={cprops['onClick']}
      >
        {column.Header}
      </div>
    )
  }

  const _renderLeftSideCell = ({
    columnIndex,
    key,
    parent,
    rowIndex,
    style,
  }) => {
    const row = page[rowIndex]
    prepareRow(row)

    const cells = row.cells.map((cell) => cell)
    const cell = [cells[columnIndex]]
    const cellProps = cell[0].getCellProps()

    const cellClass = rowIndex % 2 === 0 ? classes.evenRow : classes.oddRow

    const column = columns[columnIndex]
    const columnName = column.Header
    let originalValue = cell[0].value.props.children
    let value = originalValue
    if (originalValue !== undefined && originalValue.length > 40) {
      value = originalValue.substring(0, 40) + '...'
    }

    // console.log(columnName, value)
    return (
      // <CellMeasurer
      //   cache={cache}
      //   columnIndex={columnIndex}
      //   key={key}
      //   parent={parent}
      //   rowIndex={rowIndex}
      // >
      //   <div
      //     style={{
      //       ...style,
      //     }}
      //   >
      //     {value}
      //   </div>
      // </CellMeasurer>
      <div
        {...cell[0].getCellProps()}
        className={cellClass}
        key={key}
        style={style}
        onClick={(event) => _onCellClick(event, originalValue )}
      >
        {value}
      </div>
    )
  }
  const _onCellClick = (evt, key) => {
    console.log('EVT: cell', key)
  }

  const columnWidth = 220
  const bodyColumnWidth = 220
  const columnCount = columns.length
  const overscanColumnCount = 0
  const overscanRowCount = 5
  const rowHeight = 55
  const rowCount = page.length
  // const height: number = 800
  const getColumnWidth = (props: { index: number }) => {
    const column = columns[props.index]
    return column === undefined ? columnWidth : column.width
  }

  return (
    <div className={classes.root}>
      <div className={classes.tablePanel}>
        <ScrollSync>
          {({
            clientHeight,
            clientWidth,
            onScroll,
            scrollHeight,
            scrollLeft,
            scrollTop,
            scrollWidth,
          }) => {
            const leftColor = '#222222'
            const topColor = '#222222'
            const middleColor = '#555555'

            return (
              <div className={classes.gridRow}>
                <div
                  className={classes.leftSideGridContainer}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    color: leftColor,
                  }}
                >
                  <Grid
                    cellRenderer={_renderLeftHeaderCell}
                    className={classes.headerGrid}
                    width={columnWidth}
                    height={rowHeight}
                    rowHeight={rowHeight}
                    columnWidth={columnWidth}
                    rowCount={1}
                    columnCount={1}
                  />
                </div>
                <div
                  className={classes.leftSideGridContainer}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: rowHeight,
                    color: leftColor,
                    height: clientHeight - scrollbarWidth(),
                  }}
                >
                  <AutoSizer disableWidth>
                    {({ height }) => (
                      <Grid
                        overscanColumnCount={overscanColumnCount}
                        overscanRowCount={overscanRowCount}
                        cellRenderer={_renderLeftSideCell}
                        columnWidth={columnWidth}
                        columnCount={1}
                        className={classes.leftSideGrid}
                        height={height - scrollbarWidth()}
                        rowHeight={rowHeight}
                        rowCount={rowCount}
                        scrollTop={scrollTop}
                        width={columnWidth}
                      />
                    )}
                  </AutoSizer>
                </div>
                <div className={classes.gridColumn}>
                  <AutoSizer>
                    {({ height, width }) => (
                      <div className={classes.tableBody}>
                        <div
                          style={{
                            color: topColor,
                            height: rowHeight,
                            width: width - scrollbarWidth(),
                          }}
                        >
                          <Grid
                            className={classes.headerGrid}
                            columnWidth={columnWidth}
                            columnCount={columnCount}
                            height={rowHeight}
                            overscanColumnCount={overscanColumnCount}
                            cellRenderer={_renderHeaderCell}
                            rowHeight={rowHeight}
                            rowCount={1}
                            scrollLeft={scrollLeft}
                            width={width - scrollbarWidth()}
                          />
                        </div>
                        <div
                          style={{
                            color: middleColor,
                            height: clientHeight,
                            width,
                          }}
                        >
                          <Grid
                            className={classes.bodyGrid}
                            columnWidth={columnWidth}
                            columnCount={columnCount}
                            onScroll={onScroll}
                            overscanColumnCount={overscanColumnCount}
                            overscanRowCount={overscanRowCount}
                            cellRenderer={_renderBodyCell}
                            rowHeight={rowHeight}
                            rowCount={rowCount}
                            height={height - scrollbarWidth()}
                            width={width}
                            // columnWidth={cache.columnWidth}
                            // rowHeight={cache.rowHeight}
                            // deferredMeasurementCache={cache}
                          />
                        </div>
                      </div>
                    )}
                  </AutoSizer>
                </div>
              </div>
            )
          }}
        </ScrollSync>
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

        <div className={classes.pageLabel}>
          {`Page ${pageIndex + 1} of ${pageOptions.length}`}
        </div>

        <div className={classes.pageSelectorPanel}>
          <select
            className={classes.pageSelector}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[100, 500, 1000, 5000].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          per page
        </div>
      </div>
    </div>
  )
}

export default VirtualizedTable2
