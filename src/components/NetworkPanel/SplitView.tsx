import React, { FC, useContext, useEffect, Suspense } from 'react'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import LGRPanel from './LGRPanel'
import CytoscapeRenderer from '../CytoscapeRenderer'
import AppContext from '../../context/AppState'
import useSearch from '../../hooks/useSearch'
import SplitPane from 'react-split-pane'

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
      backgroundColor: '#AAAAAA',
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
      height: '20em',
      backgroundColor: '#0000AA',
    },
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

  // Both main and sub network should be passed from parent
  const { renderer, subNetwork, mainNetwork} = props

  const appContext = useContext(AppContext)
  const { setSelectedEdges, setSelectedNodes, cy, setCy } = appContext

  const eventHandlers = {
    setSelectedEdges,
    setSelectedNodes,
  }

  const width = window.innerWidth
  const defSize = Math.floor(width * 0.6)

  return (
    <SplitPane className={classes.root} split="horizontal" defaultSize={defSize}>
      <div className={classes.subnet}>
        <CytoscapeRenderer cy={cy} setCy={setCy} eventHandlers={eventHandlers} selectedNodes={[]} {...props} />
      </div>
      <div className={classes.lowerPanel}>
        Lower 1upper
      </div>
    </SplitPane>
  )
}

export default SplitView
