import React, { VFC, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useTable, useBlockLayout } from 'react-table'
import { useSticky } from 'react-table-sticky'

import theme from '../../../theme'

const Styles = styled.div`
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

const Table: VFC<{ columns: any[]; data: any[] }> = ({ columns, data }) => {
  const t0 = performance.now()

  // TODO: Try to use virtualized, fixed-size table for performance
  const tableBody = useRef(null)

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 150,
      width: 150,
      maxWidth: 300,
    }),
    [],
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useBlockLayout,
    useSticky,
  )

  return (
    <Styles>
      <div
        {...getTableProps()}
        className="table sticky"
        style={{ width: '100%', height: '100%' }}
      >
        <div className="header">
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

        <div {...getTableBodyProps()} className="body" ref={tableBody}>
          {rows.map((row, i) => {
            return (<div className="tr">
              <div className="td">{i}</div>
            </div>)
            // prepareRow(row)
            // return (
            //   <div {...row.getRowProps()} className="tr">
            //     {row.cells.map((cell) => {
            //       return (
            //         <div {...cell.getCellProps()} className="td">
            //           {cell.render('Cell')}
            //         </div>
            //       )
            //     })}
            //   </div>
            // )
          })}
        </div>
      </div>
    </Styles>
  )
}

export default Table
