import React, { VFC, useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTable, useBlockLayout } from 'react-table'
import { FixedSizeList } from 'react-window'
import theme from '../../../theme'

import { Grid, ScrollSync, AutoSizer } from 'react-virtualized'

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
      boxSizing: 'border-box',
      color: '#333333',
      border: '4px solid green',
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
      background: '#FFFFFF'
    },
    leftSideGrid: {
      overflow: 'hidden !important',
    },
    headerGrid: {
      width: '100%',
      overflow: 'hidden !important',
      background: '#FFFFFF'
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

const VirtualizedTable2: VFC<{
  columns: any[]
  data: any
  parentSize: [number, number]
}> = ({ columns, data, parentSize }) => {
  const headerRef = useRef(null)
  const [headerHeight, setHeaderHeight] = useState(1)

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
  const scrollBarSize = React.useMemo(() => scrollbarWidth(), [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    totalColumnsWidth,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useBlockLayout,
  )

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index]
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
    [prepareRow, rows],
  )

  const _renderBodyCell = ({ columnIndex, key, rowIndex, style }) => {
    if (columnIndex < 1) {
      return
    }

    return _renderLeftSideCell({ columnIndex, key, rowIndex, style })
  }

  const _renderHeaderCell = ({ columnIndex, key, rowIndex, style }) => {
    if (columnIndex < 1) {
      return
    }

    return _renderLeftHeaderCell({ columnIndex, key, style })
  }

  const _renderLeftHeaderCell = ({ columnIndex, key, style }) => {
    return (
      <div key={key} style={style}>
        {`C${columnIndex}`}
      </div>
    )
  }

  const _renderLeftSideCell = ({ columnIndex, key, rowIndex, style }) => {
    return (
      <div key={key} style={style}>
        {`R${rowIndex}, C${columnIndex}`}
      </div>
    )
  }

  const columnWidth = 125
  const columnCount = columns.length
  const overscanColumnCount = 0
  const overscanRowCount = 5
  const rowHeight = 40
  const rowCount = rows.length

  let height = parentSize[1]
  if (height === undefined) {
    height = 100
  }

  height = height * 0.94

  return (
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
        const x = scrollLeft / (scrollWidth - clientWidth)
        const y = scrollTop / (scrollHeight - clientHeight)

        const leftBackgroundColor = '#FF0000'
        const leftColor = '#555555'
        const topBackgroundColor = '#00FF00'
        const topColor = '#333333'
        const middleBackgroundColor = '#0000FF'
        const middleColor = '#333333'

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
              <AutoSizer disableHeight>
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
                        className={classes.bodyGrid}
                        columnWidth={columnWidth}
                        columnCount={columnCount}
                        height={height}
                        onScroll={onScroll}
                        overscanColumnCount={overscanColumnCount}
                        overscanRowCount={overscanRowCount}
                        cellRenderer={_renderBodyCell}
                        rowHeight={rowHeight}
                        rowCount={rowCount}
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
  )
}

export default VirtualizedTable2
