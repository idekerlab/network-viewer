import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import useSearch from '../../../hooks/useSearch'
import AppContext from '../../../context/AppState'
import EntryTable from './EntryTable'
import { AutoSizer } from 'react-virtualized'
import SplitPane from 'react-split-pane'
import { useParams } from 'react-router-dom'
import { getContextFromCx } from '../../../utils/contextUtil'
import useAttributes from '../../../hooks/useAttributes'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.palette.background.paper,
      display: 'grid',
      boxSizing: 'border-box',
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    table: {},
  }),
)

const SelectionList = (props) => {
  const { uuid } = useParams()
  const { cx } = props
  const { query, queryMode, selectionState, ndexCredential, config, uiState } = useContext(AppContext)
  const { data } = useSearch(uuid, query, config.ndexHttps, ndexCredential, queryMode, config.maxEdgeQuery)
  const [paneHeight, setPaneHeight] = useState(null)
  const [totalHeight, setTotalHeight] = useState(null)

  const attributes = useAttributes(uuid, cx, uiState.mainNetworkNotDisplayed)
  const minHeight = 1

  useEffect(() => {
    if (data === null || data === undefined) {
      return
    }
    const kvMap = data['kvMap']
  }, [data])

  useEffect(() => {
    if (paneHeight >= totalHeight) {
      setPaneHeight(totalHeight - minHeight)
    }
  }, [totalHeight])

  const context = useMemo(() => getContextFromCx(cx), [cx])

  const handleChange = (newHeight) => {
    if (totalHeight - newHeight < minHeight) {
      setPaneHeight(totalHeight - minHeight)
    } else {
      setPaneHeight(newHeight)
    }
  }

  let nodes = []
  let edges = []
  let nodeCount
  let edgeCount
  if (selectionState.lastSelected.fromMain) {
    nodes = selectionState.main['nodes']
    edges = selectionState.main['edges']
  } else {
    nodes = selectionState.sub['nodes']
    edges = selectionState.sub['edges']
  }
  nodeCount = nodes.length
  edgeCount = edges.length

  return (
    <AutoSizer>
      {({ height, width }) => {
        if (height !== totalHeight) {
          setTotalHeight(height)
        }
        if ((paneHeight == null || paneHeight <= 0) && totalHeight > 0) {
          setPaneHeight(totalHeight / 2)
        }
        return (
          <SplitPane
            split="horizontal"
            size={paneHeight}
            maxSize={0}
            onDragFinished={handleChange}
            primary={'second'}
            minSize={minHeight}
          >
            <EntryTable
              key={'selected-nodes'}
              label={`Selected Nodes (${nodeCount})`}
              selectedObjects={nodes}
              attributes={attributes.nodeAttr}
              context={context}
              width={width}
              height={totalHeight - paneHeight}
            />

            <EntryTable
              key={'selected-edges'}
              label={`Selected Edges (${edgeCount})`}
              selectedObjects={edges}
              attributes={attributes.edgeAttr}
              type={'edge'}
              context={context}
              width={width}
              height={paneHeight}
            />
          </SplitPane>
        )
      }}
    </AutoSizer>
  )
}

export default SelectionList
