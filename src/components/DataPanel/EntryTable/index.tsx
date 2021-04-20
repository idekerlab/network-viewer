import React, { useMemo, useEffect, useState, useContext } from 'react'
import Linkify from 'linkifyjs/react'
import Table from './Table'
import {
  processList,
  processItem,
  processInternalLink,
  processListAsText,
} from '../../../utils/contextUtil'
import AppContext from '../../../context/AppState'

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

const EntryTable = (props) => {
  const {
    selectedObjects,
    attributes,
    type,
    context,
    letterWidths,
    label,
  } = props
  const { config } = useContext(AppContext)
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

  const getWidth = (phrase) => {
    if (phrase === undefined) {
      phrase = ''
    }
    let width = 0
    for (let i = 0; i < phrase.length; i++) {
      let letter = phrase[i]
      if (letter === ' ') {
        letter = '&nbsp'
      }
      if (letterWidths[letter] == undefined) {
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

  const columns = useMemo(() => {
    const columnsList = []
    for (let id of selectedObjects) {
      const attrs = attributes[id]
      if (attrs === undefined || attrs === null) {
        continue
      }
      for (let attr of attrs) {
        if (
          attr[0] === Attributes.NAME ||
          (type === 'edge' &&
            (attr[0] === EdgeAttributes.SOURCE ||
              attr[0] === EdgeAttributes.TARGET ||
              attr[0] === EdgeAttributes.INTERACTION))
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
    columnsList.unshift(Attributes.NAME)
    if (type === 'edge') {
      //Add name for edges that don't have one
      for (let id of selectedObjects) {
        const attrs = attributes[id]
        if (!attrs.has(Attributes.NAME)) {
          if (
            attrs.has(EdgeAttributes.SOURCE) &&
            attrs.has(EdgeAttributes.TARGET)
          ) {
            if (attrs.has(EdgeAttributes.INTERACTION)) {
              attrs.set(
                Attributes.NAME,
                attrs.get(EdgeAttributes.SOURCE) +
                  ' (' +
                  attrs.get(EdgeAttributes.INTERACTION) +
                  ') ' +
                  attrs.get(EdgeAttributes.TARGET),
              )
            } else {
              attrs.set(
                Attributes.NAME,
                attrs.get(EdgeAttributes.SOURCE) +
                  ' (-) ' +
                  attrs.get(EdgeAttributes.TARGET),
              )
            }
          }
        }
      }
    }
    return columnsList
  }, [selectedObjects])

  const data = useMemo(() => {
    const dataList = []
    const textDataList = []
    for (let id of selectedObjects) {
      const attrs = attributes[id]
      if (attrs == undefined) {
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
          if (column == Attributes.NDEX_INTERNAL_LINK) {
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
        row[key] = <Linkify target="_blank">{value}</Linkify>
      }
    }

    return [sortedDataList, textDataList]
  }, [selectedObjects])

  const finalColumns = useMemo(() => {
    //Put columns in correct order
    let hasName = false
    let hasRepresents = false
    if (columns.includes(Attributes.NAME)) {
      hasName = true
      columns.splice(columns.indexOf(Attributes.NAME), 1)
    }
    if (columns.includes(NodeAttributes.REPRESENTS)) {
      hasRepresents = true
      columns.splice(columns.indexOf(NodeAttributes.REPRESENTS), 1)
    }
    columns.sort((a, b) => a.localeCompare(b))
    if (hasRepresents) {
      columns.unshift(NodeAttributes.REPRESENTS)
    }
    if (hasName) {
      columns.unshift(Attributes.NAME)
    }
    const columnsObject = columns.map((column) => {
      if (column === Attributes.NAME) {
        return {
          Header: label,
          accessor: Attributes.NAME,
          width: getColumnWidth(data[1], Attributes.NAME, label),
        }
      } else {
        return {
          Header: column,
          accessor: replacePeriods(column),
          width: getColumnWidth(data[1], column, column),
        }
      }
    })
    return columnsObject
  }, [selectedObjects])

  useEffect(() => {
    setState(!state)
  }, [selectedObjects])

  return <Table columns={finalColumns} data={data[0]} />
}

export default EntryTable
