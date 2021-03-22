import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import SplitPane from 'react-split-pane'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import GraphObjectPropertyPanel from './GraphObjectPropertyPanel'
import NetworkPropertyPanel from './NetworkPropertyPanel'
import { AutoSizer } from 'react-virtualized'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      position: 'relative',
    },
    dataPanel: {
      flexGrow: 1,
      width: '100%',
      height: '100%',
      backgroundColor: '#FEFEFE',
    },
  }),
)
const DataPanel = ({ cx }) => {
  const classes = useStyles()
  const defSize = window.innerHeight * 0.7
  const minSize = window.innerHeight * 0.1

  const [totalHeight, setTotalHeight] = useState(0)
  const [paneHeight, setPaneHeight] = useState(defSize)

  const handleChange = (newHeight) => {
    if (newHeight >= totalHeight) {
      setPaneHeight(totalHeight - minSize)
    } else {
      setPaneHeight(newHeight)
    }
  }

  return (
    <div className={classes.container}>
      <AutoSizer disableWidth>
        {({ height, width }) => {
          if (height !== totalHeight) {
            setTotalHeight(height)
          }
          return (
            <SplitPane
              className={classes.dataPanel}
              split="horizontal"
              minSize={minSize}
              size={paneHeight}
              onDragFinished={handleChange}
              maxSize={0}
            >
              <NetworkPropertyPanel cx={cx} />
              <GraphObjectPropertyPanel cx={cx} />
            </SplitPane>
          )
        }}
      </AutoSizer>
    </div>
  )
}

export default DataPanel
