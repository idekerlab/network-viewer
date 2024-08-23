import React, { VFC, useMemo, useContext } from 'react'
import Linkify from 'linkify-react'
import {
  processList,
  processItem,
  processInternalLink,
  processListAsText,
} from '../../../utils/contextUtil'
import AppContext from '../../../context/AppState'
import VirtualizedTable2 from './VirtualizedTable2'

// All attributes with this prefix will not be displayed
export const HIDDEN_ATTR_PREFIX: string = '__'

// Special cases: Virtual Columns
const EdgeAttributes = {
  SOURCE: 'source',
  TARGET: 'target',
  INTERACTION: 'interaction',
}

const NodeAttributes = {
  REPRESENTS: 'Represents',
}

const Attributes = {
  NAME: 'name',
  NDEX_INTERNAL_LINK: 'ndex:internalLink',
}

const regex = /\./gi
const replacePeriods = (text: string): string => {
  return text.replace(regex, '(_)')
}

const isEmptyString = (text: string): boolean => {
  return text === undefined || text === ''
}
const startsWithNumber = (entry: string): boolean => {
  if (
    entry === undefined ||
    entry === null ||
    typeof entry !== 'string' ||
    entry.length === 0
  ) {
    return false
  }
  return '0123456789'.includes(entry.charAt(0))
}

const EntryTable: VFC<{
  selectedObjects: any[]
  attributes: any
  type?: string
  context
  letterWidths
  parentSize: [number, number]
  selected: boolean
}> = ({
  selectedObjects,
  attributes,
  type,
  context,
  letterWidths,
  parentSize,
  selected,
}) => {
  const { config } = useContext(AppContext)

  const getWidth = (phrase: string | undefined): number => {
    if (phrase === undefined) {
      phrase = ''
    }
    let width: number = 0
    for (let i = 0; i < phrase.length; i++) {
      let letter = phrase[i]
      if (letter === ' ') {
        letter = '&nbsp'
      }
      if (letterWidths[letter] === undefined) {
        width += letterWidths['default']
      } else {
        width += letterWidths[letter]
      }
    }
    return width
  }

  const getColumnWidth = (rows, accessor, header) => {
    const PADDING = 18
    const MAX_WIDTH = 300 + PADDING
    const width =
      Math.max(
        ...rows.map((row) => getWidth(`${row[accessor]}` || '')),
        getWidth(header),
      ) + PADDING
    return Math.min(MAX_WIDTH, width)
  }

  const filterColumns = (allColumns: string[]): string[] => {
    return allColumns.filter(
      (colName) => !colName.startsWith(HIDDEN_ATTR_PREFIX),
    )
  }

  const columns: string[] = useMemo((): string[] => {
    const columnsList: string[] = []
    for (let id of selectedObjects) {
      if (attributes === undefined || attributes === null) {
        continue
      }

      const attrs = attributes[id]
      if (attrs === undefined || attrs === null) {
        continue
      }
      for (let attr of attrs) {
        if (attr[0] === Attributes.NAME) {
          continue
        } else {
          if (Array.isArray(attr[1])) {
            for (let item of attr[1]) {
              if (item !== undefined && item !== '') {
                if (!columnsList.includes(attr[0])) {
                  columnsList.push(attr[0])
                }
                break
              }
            }
          } else {
            if (attr[1] !== undefined && attr[1] !== '') {
              if (!columnsList.includes(attr[0])) {
                columnsList.push(attr[0])
              }
            }
          }
        }
        if (columnsList.length + 1 === attrs.length) {
          break
        }
      }
    }
    columnsList.unshift(Attributes.NAME)
    return filterColumns(columnsList)
  }, [selectedObjects])

  const data = useMemo(() => {
    const dataList = []
    const textDataList = []
    let idx = 0
    for (let id of selectedObjects) {
      if (attributes === undefined) {
        continue
      }

      const attrs = attributes[id]
      if (attrs === undefined) {
        continue
      }
      const row = {}
      const textRow = {}
      for (let column of columns) {
        const value = attrs.get(column)
        if (Array.isArray(value)) {
          row[replacePeriods(column)] = processList(value, context)
          textRow[replacePeriods(column)] = processListAsText(value)
        } else {
          if (column === Attributes.NDEX_INTERNAL_LINK) {
            row[column] = processInternalLink(attrs.get(column), config.ndexUrl)
          } else {
            row[replacePeriods(column)] = processItem(
              attrs.get(column),
              context,
              true,
            )
          }
          textRow[replacePeriods(column)] = attrs.get(column)
        }
      }
      dataList.push(row)
      textDataList.push(textRow)
      idx++
    }

    const empty = dataList.filter((entry) => isEmptyString(entry.name))
    const nonEmpty = dataList.filter((entry) => !isEmptyString(entry.name))

    let nonNumbers = nonEmpty.filter((entry) => !startsWithNumber(entry.name))
    let numbers = nonEmpty.filter((entry) => startsWithNumber(entry.name))

    nonNumbers.sort((a, b) => (a.name > b.name ? 1 : -1))
    numbers.sort((a, b) => (a.name > b.name ? 1 : -1))

    const sortedDataList = nonNumbers.concat(numbers).concat(empty)
    for (let i = 0; i < sortedDataList.length; i++) {
      const row = sortedDataList[i]
      for (const [key, value] of Object.entries(row)) {
        row[key] = <Linkify>{value}</Linkify>
      }
    }

    return [sortedDataList, textDataList]
  }, [selectedObjects, columns])

  const finalColumns = useMemo(() => {
    //Put columns in correct order
    const priorityColumns = [
      Attributes.NAME,
      NodeAttributes.REPRESENTS,
      EdgeAttributes.SOURCE,
      EdgeAttributes.INTERACTION,
      EdgeAttributes.TARGET,
    ]

    const priorityColumnName = {
      [Attributes.NAME]: 'name',
      [NodeAttributes.REPRESENTS]: 'represents',
      [EdgeAttributes.SOURCE]: 'source node',
      [EdgeAttributes.INTERACTION]: 'interaction',
      [EdgeAttributes.TARGET]: 'target node',
    }

    const orderedColumns = priorityColumns.filter((col) =>
      columns.includes(col),
    )
    const remainingColumns = columns.filter(
      (col) => !priorityColumns.includes(col),
    )
    remainingColumns.sort((a, b) => a.localeCompare(b))
    const combinedColumns = [...orderedColumns, ...remainingColumns]

    return combinedColumns.map((column) => {
      return {
        Header: priorityColumns.includes(column)
          ? priorityColumnName[column]
          : column,
        accessor: replacePeriods(column),
        width: getColumnWidth(data[1], column, column),
      }
    })
  }, [selectedObjects, data, columns])

  return (
    <VirtualizedTable2
      columns={finalColumns}
      data={data[0]}
      parentSize={parentSize}
      selected={selected}
    />
  )
}

export default EntryTable
