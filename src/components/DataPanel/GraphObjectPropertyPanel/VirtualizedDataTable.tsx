import React, { PureComponent } from 'react'
import clsx from 'clsx'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import { AutoSizer, Column, Table, TableCellRenderer, TableHeaderProps } from 'react-virtualized'

declare module '@material-ui/core/styles/withStyles' {
  interface BaseCSSProperties {
    /*
     * Used to control if the rule-set should be affected by rtl transformation
     */
    flip?: boolean
  }
}

const styles = (theme: Theme) =>
  createStyles({
    flexContainer: {
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
    },
    table: {
      // temporary right-to-left patch, waiting for
      // https://github.com/bvaughn/react-virtualized/issues/454
      '& .ReactVirtualized__Table__headerRow': {
        flip: false,
        paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined,
      },
    },
    tableRow: {
      cursor: 'pointer',
    },
    tableRowHover: {
      '&:hover': {
        backgroundColor: theme.palette.grey[200],
      },
    },
    tableCell: {
      flex: 1,
    },
    noClick: {
      cursor: 'initial',
    },
  })

interface ColumnData {
  dataKey: string
  label: string
  numeric?: boolean
  width: number
}

interface Row {
  index: number
}

interface MuiVirtualizedTableProps extends WithStyles<typeof styles> {
  columns: ColumnData[]
  headerHeight?: number
  onRowClick?: () => void
  rowCount: number
  rowGetter: (row: Row) => Data
  rowHeight?: number
}

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.common.white,
      fontSize: '0.8em',
    },
    body: {
      fontSize: '0.7em',
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

class MuiVirtualizedTable extends PureComponent<MuiVirtualizedTableProps> {
  static defaultProps = {
    headerHeight: 40,
    rowHeight: 30,
  }

  getRowClassName = ({ index }: Row) => {
    const { classes, onRowClick } = this.props

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    })
  }

  cellRenderer: TableCellRenderer = ({ cellData, columnIndex }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props

    let fontWeight = 300

    let fontSize = '0.8em'
    if(columnIndex === 0) {
      fontWeight = 700
      fontSize = '1em'
    }


    return (
      <StyledTableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight, fontWeight, fontSize }}
        align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
      >
        {cellData}
      </StyledTableCell>
    )
  }

  headerRenderer = ({ label, columnIndex }: TableHeaderProps & { columnIndex: number }) => {
    const { headerHeight, columns, classes } = this.props

    return (
      <StyledTableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? 'right' : 'left'}
      >
        <span>{label}</span>
      </StyledTableCell>
    )
  }

  createRowStyle = (rowIdx) => {
    const idx = rowIdx.index
    const backgroundColor = idx % 2 ? 'white' : '#EFEFEF'

    return { backgroundColor }
  }

  render() {
    const { classes, columns, rowHeight, headerHeight, ...tableProps } = this.props
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height / 2}
            width={width}
            rowStyle={idx => this.createRowStyle(idx)}
            rowHeight={rowHeight!}
            gridStyle={{
              direction: 'inherit',
            }}
            headerHeight={headerHeight!}
            className={classes.table}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={(headerProps) =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              )
            })}
          </Table>
        )}
      </AutoSizer>
    )
  }
}

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable)

interface Data {
  id: string
  propName: string
  value: string
}

// const rows: Data[] = [{ propName: 'Attr 1', value: 'val1' }]

const VirtualizedDataTable = ({ data, label }) => {
  return (
    <VirtualizedTable
      rowCount={data.length}
      rowGetter={({ index }) => data[index]}
      columns={[
        {
          width: 200,
          label: label,
          dataKey: 'id',
        },
        {
          width: 200,
          label: 'Property Name',
          dataKey: 'propName',
        },
        {
          width: 200,
          label: 'Value',
          dataKey: 'value',
        },
      ]}
    />
  )
}

export default VirtualizedDataTable
