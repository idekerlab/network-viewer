import React, { useMemo, useEffect, useState } from 'react'
import Table from './Table'
import Twinble from './Table2'

const EntryTable = (props) => {
  const { selectedObjects, attributes, label } = props
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
    const spacing = 10
    const maxWidth = 300

    const cellLength = Math.max(...rows.map((row) => (`${row[accessor]}` || '').length), header.length)
    return Math.min(maxWidth, cellLength * spacing)
  }

  const columns = useMemo(() => {
    const columnsList = []
    let hasName = false
    for (let id of selectedObjects) {
      const attrs = attributes[id]
      if (attrs === undefined) {
        continue
      }
      for (let attr of attrs) {
        if (attr[0] === 'name') {
          hasName = true
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
    if (hasName) {
      columnsList.unshift('name')
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
          row[replacePeriods(column)] = value.join(', ')
        } else {
          row[replacePeriods(column)] = attrs.get(column)
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
