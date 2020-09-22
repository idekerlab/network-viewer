import React, { useMemo } from 'react'
import Table from './Table'

const EntryTable = (props) => {
  const { selectedObjects, attributes, label } = props

  const replacePeriods = (string) => {
    const regex = /\./gi
    return string.replace(regex, '(_)')
  }

  const getColumnWidth = (rows, accessor, header) => {
    const spacing = 10
    const maxWidth = 300

    const cellLength = Math.max(...rows.map((row) => (`${row[accessor]}` || '').length), header.length)
    return Math.min(maxWidth, cellLength * spacing)
  }

  const columns = useMemo(() => {
    const columnsList = []
    for (let id of selectedObjects) {
      const attrs = attributes[id]
      if (attrs === undefined) {
        continue
      }
      for (let attr of attrs) {
        if (attr[0] !== 'name') {
          if (Array.isArray(attr[1])) {
            for (let item of attr[1]) {
              if (item !== '') {
                if (!columnsList.includes(attr[0])) {
                  columnsList.push(attr[0])
                }
                break
              }
            }
          } else {
            if (attr[1] !== '') {
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
    if (columnsList.length > 0) {
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
    return dataList
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

  return <Table columns={finalColumns} data={data} />
}

export default EntryTable
