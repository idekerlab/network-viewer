import React, { useMemo, useEffect, useState } from 'react'
import Table from './Table'
import Twinble from './Table2'
import { processList, processItem } from '../../../utils/contextUtil'
import pixelWidth from 'string-pixel-width'

const EntryTable = (props) => {
  const { selectedObjects, attributes, label, type, context } = props
  const [state, setState] = useState(true)

  const replacePeriods = (string) => {
    const regex = /\./gi
    return string.replace(regex, '(_)')
  }

  const isEmptyString = (string) => {
    return string === undefined || string === ''
  }

  const startsWithNumber = (string) => {
    if (string === undefined || string === '') {
      return false
    }
    return '0123456789'.includes(string.charAt(0))
  }

  const getColumnWidth = (rows, accessor, header) => {
    const PADDING = 40
    const MAX_WIDTH = 300 + PADDING
    const width =
      Math.max(
        ...rows.map((row) => pixelWidth(`${row[accessor]}` || '', { font: 'helvetica', size: 15 })),
        pixelWidth(header, { font: 'helvetica', size: 15 }),
      ) + PADDING
    return Math.min(MAX_WIDTH, width)
  }

  const columns = useMemo(() => {
    const columnsList = []
    for (let id of selectedObjects) {
      const attrs = attributes[id]
      for (let attr of attrs) {
        if (
          attr[0] === 'name' ||
          (type === 'edge' && (attr[0] === 'source' || attr[0] === 'target' || attr[0] === 'interaction'))
        ) {
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
    columnsList.unshift('name')
    if (type === 'edge') {
      //Add name for edges that don't have one
      for (let id of selectedObjects) {
        const attrs = attributes[id]
        if (!attrs.has('name')) {
          if (attrs.has('source') && attrs.has('target')) {
            if (attrs.has('interaction')) {
              attrs.set('name', attrs.get('source') + ' (' + attrs.get('interaction') + ') ' + attrs.get('target'))
            } else {
              attrs.set('name', attrs.get('source') + ' (-) ' + attrs.get('target'))
            }
          }
        }
      }
    }
    return columnsList
  }, [selectedObjects])

  const data = useMemo(() => {
    const dataList = []
    for (let id of selectedObjects) {
      const attrs = attributes[id]
      if (attrs == undefined) {
        continue
      }
      const row = {}
      for (let column of columns) {
        const value = attrs.get(column)
        if (Array.isArray(value)) {
          row[replacePeriods(column)] = processList(value, context)
        } else {
          row[replacePeriods(column)] = processItem(attrs.get(column), context, true)
        }
      }
      dataList.push(row)
    }

    const empty = dataList.filter((entry) => isEmptyString(entry.name))
    const nonEmpty = dataList.filter((entry) => !isEmptyString(entry.name))

    let nonNumbers = nonEmpty.filter((entry) => !startsWithNumber(entry.name))
    let numbers = nonEmpty.filter((entry) => startsWithNumber(entry.name))

    nonNumbers.sort((a, b) => (a.name > b.name ? 1 : -1))
    numbers.sort((a, b) => (a.name > b.name ? 1 : -1))

    return nonNumbers.concat(numbers).concat(empty)
  }, [selectedObjects])

  const finalColumns = useMemo(() => {
    const columnsObject = columns.map((column) => {
      if (column === 'name') {
        return {
          Header: label,
          accessor: 'name',
          minWidth: getColumnWidth(data, 'name', label),
        }
      } else {
        return {
          Header: column,
          accessor: replacePeriods(column),
          minWidth: getColumnWidth(data, column, column),
        }
      }
    })
    return columnsObject
  }, [selectedObjects])

  useEffect(() => {
    setState(!state)
  }, [selectedObjects])

  //The DynamicSizeList used in the Table component has trouble updating
  //So I'm doing this to force it to make a whole new table every time
  //Please fix if there's a better way
  return state ? <Table columns={finalColumns} data={data} /> : <Twinble columns={finalColumns} data={data} />
}

export default EntryTable
