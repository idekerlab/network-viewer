import React, {useState} from 'react'
import SplitPane, { Pane } from 'react-split-pane'

import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import GraphObjectPropertyPanel from './GraphObjectPropertyPanel'
import NetworkPropertyPanel from './NetworkPropertyPanel'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dataPanel: {
      width: '100%',
      height: '100%',
      backgroundColor: '#FAFAFA',
    },
  }),
)
const DataPanel = (props) => {
  const classes = useStyles()
  const height = window.innerHeight
  const defSize = Math.floor(height * 0.5)
  const [bottomHeight, setBottomHeight] = useState(defSize)

  const handleChange = (size) => {
    console.log('change:', size)
    const windowHeight = window.innerHeight
    setBottomHeight(windowHeight-size)

  }

  return (
    <SplitPane
      className={classes.dataPanel}
      split="horizontal"
      minSize={150}
      defaultSize={defSize}
      onDragFinished={(size) => handleChange(size)}
    >
      <NetworkPropertyPanel />
      <GraphObjectPropertyPanel height={bottomHeight} />
    </SplitPane>
  )
}

export default DataPanel
