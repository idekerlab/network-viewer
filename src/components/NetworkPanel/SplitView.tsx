import React, { FC, useContext, useEffect, Suspense } from 'react'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import LGRPanel from './LGRPanel'
import CytoscapeRenderer from '../CytoscapeRenderer'
import AppContext from '../../context/AppState'
import SplitPane from 'react-split-pane'
import { useParams } from 'react-router-dom'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      backgroundColor: '#FFFFFF',
    },
    subnet: {
      width: '100%',
      height: '100%',
    },
    loading: {
      width: '100%',
      height: '100%',
      backgroundColor: '#999999',
      display: 'grid',
      placeItems: 'center',
    },
    lowerPanel: {
      width: '100%',
      height: '100%',
      backgroundColor: '#F0F0F0',
      opacity: 0.5
    },
    title: {
      position: 'absolute',
      top: '1em',
      left: '1em',
      color: 'rgba(10,10,10,1)',
      zIndex: 100
    }
  }),
)


/**
 * 
 * For now, Upper panel always uses Cyjs.
 * 
 * @param props
 */
const SplitView = (props) => {
  const classes = useStyles()
  const { uuid } = useParams()

  // Both main and sub network should be passed from parent
  const { renderer, cx, subCx } = props
  console.log('subCx', subCx)

  const appContext = useContext(AppContext)
  const { setSelectedEdges, setSelectedNodes } = appContext

  const eventHandlers = {
    setSelectedEdges,
    setSelectedNodes,
  }

  const height = window.innerHeight
  const defSize = Math.floor(height * 0.6)
  const lowerSize = height-defSize

  return (
    <SplitPane className={classes.root} split="horizontal" defaultSize={defSize}>
      <div className={classes.subnet}>
        <CytoscapeRenderer
          uuid={uuid}
          cx={subCx}
          eventHandlers={eventHandlers}
          selectedNodes={[]}
          layoutName={'cose'}
        />
        
      </div>
      <div className={classes.lowerPanel}>
        <Typography className={classes.title} variant="h6">Overview</Typography>
        <CytoscapeRenderer
          uuid={uuid}
          cx={cx}
          eventHandlers={eventHandlers}
          selectedNodes={[]}
          options={{
            selectable: false, 
            locked: true, 
            grabbable: false, 
            pannable: true
          }}
        />
      </div>
    </SplitPane>
  )
}

export default SplitView
