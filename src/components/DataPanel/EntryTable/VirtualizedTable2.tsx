import React, { FC, useRef, useState, useEffect } from 'react'
import { useTable, usePagination, useSortBy, useFlexLayout } from 'react-table'

import {
  Grid,
  ScrollSync,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from 'react-virtualized'

import SortIcon from '@material-ui/icons/Sort'
import DownIcon from '@material-ui/icons/ArrowDropDown'
import UpIcon from '@material-ui/icons/ArrowDropUp'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Popup from './Popup'

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

// Base styles for the entire panel
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
      // border: '5px solid red',
      overflow: 'hidden',
    },

    // Area for virtualized table
    tablePanel: {
      flexGrow: 1,
      width: '100%',
      height: '100%',
      // border: '6px solid darkorange',
      boxSizing: 'border-box',
      overflowY: 'hidden',
    },

    tableBody: {
      flexGrow: 1,
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
    pagination: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      background: theme.palette.background.paper,
      height: '3em',
      padding: theme.spacing(1),
      borderTop: `1px solid ${theme.palette.divider}`,
      boxSizing: 'border-box',
      zIndex: 100,
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
      flex: '0 0 75px',
      zIndex: 10,
      backgroundColor: theme.palette.background.default,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    leftSideGrid: {
      overflow: 'hidden !important',
      paddingLeft: '0.5em',
    },
    headerGrid: {
      width: '100%',
      overflow: 'hidden !important',
      borderBottom: '1px solid #999999',
      paddingLeft: '0.5em',
    },
    bodyGrid: {
      width: '100%',
    },

    evenRow: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingLeft: '0.5em',
    },
    oddRow: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      backgroundColor: 'rgba(150, 150, 150, .1)',
      paddingLeft: '0.5em',
    },

    cell: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
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
    },
    sortableHeader: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    sortButton: {
      marginLeft: '0.3em',
      border: '1px solid #BBBBBB',
      borderRadius: '10%',
      cursor: 'pointer',
      background: '#FFFFFF',
    },
    cellOverflow: {
      cursor: 'pointer',
      wordWrap: 'break-word',
      width: '100%',
      overflowWrap: 'break-word'
    },
  })
})

const VirtualizedTable2: FC<{
  columns: any[]
  data: any
  parentSize: [number, number]
  selected: boolean
}> = ({ columns, data, parentSize, selected }) => {
  const classes = useStyles()

  // Popup control
  const [openPopup, setOpenPopup] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [selectedValue, setSelectedValue] = useState(null)

  const gridRef = useRef(null)
  const pageRef = useRef(null)
  const rootRef = useRef(null)

  const [pagePanelHeight, setPagePanelHeight] = useState(1)
  const [rootPanelHeight, setRootPanelHeight] = useState(1)

  const defaultColumn = React.useMemo(
    () => ({
      width: 150,
    }),
    [],
  )

  const _handleResize = (evt) => {
    if (rootRef.current === undefined || rootRef.current === null) {
      return
    }
    const height = rootRef.current.offsetHeight
    if (height !== 0) {
      setRootPanelHeight(height)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', _handleResize)
  }, [])

  useEffect(() => {
    if (rootRef.current === undefined || rootRef.current === null) {
      return
    }
    const height = rootRef.current.offsetHeight
    setRootPanelHeight(height)
  }, [rootRef])

  useEffect(() => {
    const height = pageRef.current.offsetHeight
    const rootHeight = rootRef.current.offsetHeight

    if (height !== 0) {
      setPagePanelHeight(height)
    }

    if (rootHeight !== 0) {
      setRootPanelHeight(rootHeight)
    }
    // updateHeight()
  }, [selected])

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
    // useBlockLayout,
    useFlexLayout,
  )

  const _handleGoToPage = (index: number): void => {
    gotoPage(index)
    gridRef.current.scrollToCell({
      columnIndex: 0,
      rowIndex: 0,
    })
  }
  const _handleNextPage = (): void => {
    nextPage()
    gridRef.current.scrollToCell({
      columnIndex: 0,
      rowIndex: 0,
    })
  }

  const _handlePreviousPage = (): void => {
    previousPage()
    gridRef.current.scrollToCell({
      columnIndex: 0,
      rowIndex: 0,
    })
  }

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

  // Render a cell in the column header.
  const _renderLeftHeaderCell = ({ columnIndex, key, style }) => {
    const headerGroup = headerGroups[0]
    const column = headerGroup.headers[columnIndex]

    const _handleSort = (targetColumn) => {
      if (columnIndex !== 0) {
        targetColumn.canSort = false
        return
      }
      targetColumn.toggleSortBy(!targetColumn.isSortedDesc)
    }

    const getSortButton = () => {
      if (columnIndex !== 0) {
        column.canSort = false
        return null
      }

      if (column.isSorted) {
        if (column.isSortedDesc) {
          return <DownIcon className={classes.sortButton} />
        } else {
          return <UpIcon className={classes.sortButton} />
        }
      } else {
        return <SortIcon className={classes.sortButton} />
      }
    }

    return (
      <div
        key={key}
        style={{
          ...style,
          display: 'grid',
          alignContent: 'center',
        }}
        onClick={() => _handleSort(column)}
      >
        <div className={classes.sortableHeader}>
          {column.Header}
          {getSortButton()}
        </div>
      </div>
    )
  }

  const valueLengthTH: number = 40
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

    const cellClass = rowIndex % 2 === 0 ? classes.evenRow : classes.oddRow

    let originalValue = cell[0].value.props.children
    let value = originalValue

    let isLongValue = false
    if (originalValue !== undefined && originalValue.length > valueLengthTH) {
      value = originalValue.substring(0, valueLengthTH)
      isLongValue = true
    }

    return (
      <div
        {...cell[0].getCellProps()}
        className={cellClass}
        key={key}
        style={style}
        onClick={(event) => _onCellClick(event, originalValue)}
      >
        {isLongValue ? (
          <p className={classes.cellOverflow}>{`${value}...`}</p>
        ) : (
          value
        )}
      </div>
    )
  }

  const _onCellClick = (evt, value) => {
    if (value !== null && value !== undefined && value.length > valueLengthTH) {
      setOpenPopup(true)
      setPosition({ x: evt.pageX, y: evt.pageY })
      setSelectedValue(value)
    }
  }

  const columnWidth = 200
  const columnCount = columns.length
  const overscanColumnCount = 0
  const overscanRowCount = 5
  const rowHeight = 57
  const rowCount = page.length
  const height: number = rootPanelHeight - (pagePanelHeight + rowHeight)

  return (
    <>
      <div ref={rootRef} className={classes.root}>
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
              const middleColor = '#222222'

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
                    }}
                  >
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
                  </div>
                  <div className={classes.gridColumn}>
                    <AutoSizer>
                      {({ width }) => (
                        <div>
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
                              height,
                              width,
                            }}
                          >
                            <Grid
                              ref={gridRef}
                              className={classes.bodyGrid}
                              columnWidth={columnWidth}
                              columnCount={columnCount}
                              onScroll={onScroll}
                              overscanColumnCount={overscanColumnCount}
                              overscanRowCount={overscanRowCount}
                              cellRenderer={_renderBodyCell}
                              rowHeight={rowHeight}
                              rowCount={rowCount}
                              height={height}
                              width={width}
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

        <div ref={pageRef} className={classes.pagination}>
          <div className={classes.buttons}>
            <button
              className={classes.button}
              onClick={() => _handleGoToPage(0)}
              disabled={!canPreviousPage}
            >
              {'<<'}
            </button>
            <button
              className={classes.button}
              onClick={() => _handlePreviousPage()}
              disabled={!canPreviousPage}
            >
              {'<'}
            </button>
            <button
              className={classes.button}
              onClick={() => _handleNextPage()}
              disabled={!canNextPage}
            >
              {'>'}
            </button>
            <button
              className={classes.button}
              onClick={() => _handleGoToPage(pageCount - 1)}
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
              {[100, 500, 1000, 5000, 10000].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            per page
          </div>
        </div>
      </div>

      <Popup
        x={position.x}
        y={position.y}
        open={openPopup}
        setOpen={setOpenPopup}
        value={selectedValue}
      />
    </>
  )
}

export default VirtualizedTable2
