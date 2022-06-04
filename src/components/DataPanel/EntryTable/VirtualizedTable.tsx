import React, { VFC, useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTable, useBlockLayout } from 'react-table'
import { FixedSizeList } from 'react-window'
import theme from '../../../theme'
import AutoSizer from 'react-virtualized-auto-sizer'

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

const Styles2 = styled.div`
  overflow: auto;

  .table {
    border: 1px solid #ddd;

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th {
      background-color: ${theme.palette.secondary.main};
    }

    .td {
      background-color: #fff;
    }

    .th,
    .td {
      padding: 5px;
      border-bottom: 1px solid #ddd;
      border-right: 1px solid #ddd;
      overflow: hidden;

      :last-child {
        border-right: 0;
      }

      .resizer {
        display: inline-block;
        width: 5px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(50%);
        z-index: 1;

        &.isResizing {
          background: red;
        }
      }
    }

    &.sticky {
      overflow: auto;
      .header,
      .header {
        position: sticky;
        z-index: 1;
        top: 0;
        width: fit-content;
        box-shadow: 0px 3px 3px #ccc;
        color: white;
        background-color: ${theme.palette.secondary.main};
      }

      .body {
        position: relative;
        z-index: 0;
        // height: fit-content;
      }

      [data-sticky-td] {
        // position: sticky;
      }

      [data-sticky-last-left-td] {
        box-shadow: 2px 0px 3px #ccc;
      }

      [data-sticky-first-right-td] {
        box-shadow: -2px 0px 3px #ccc;
      }
    }
  }
`
const Styles = styled.div`
  width: 100%;
  height: 100%;
  padding: 0em;
  margin: 0;
  overflow: auto;

  .table {
    border-spacing: 0;

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th {
      padding: 1em;
      text-align: center;
      text-valign: center;
      border-bottom: 2px solid #999999;
      background-color: ${theme.palette.primary.main};
      // font-weight: bold;
    }
    .td {
      margin: 0;
      padding: 0.2em;
      border-bottom: 1px solid #aaaaaa;
      border-right: 1px solid #aaaaaa;

      :last-child {
        border-right: 1px solid #aaaaaa;
      }
    }
  }
`

const VirtualizedTable: VFC<{
  columns: any[]
  data: any
  parentSize: [number, number]
}> = ({ columns, data, parentSize }) => {
  const headerRef = useRef(null)
  const [headerHeight, setHeaderHeight] = useState(1)

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

  let height = parentSize[1]
  if (height === undefined) {
    height = 100
  }

  height = height * 0.9
  // const width = totalColumnsWidth + scrollBarSize

  // Render the UI for your table
  return (
    <Styles>
      <div {...getTableProps()} className="table">
        <div ref={headerRef}>
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map((column) => (
                <div {...column.getHeaderProps()} className="th">
                  {column.render('Header')}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div {...getTableBodyProps()}>
          <FixedSizeList
            height={height}
            itemCount={rows.length}
            itemSize={40}
            width={totalColumnsWidth + scrollBarSize}
          >
            {RenderRow}
          </FixedSizeList>
        </div>
      </div>
    </Styles>
  )
}

export default VirtualizedTable
