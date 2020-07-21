import React, { FC, useContext, useEffect, Suspense } from 'react'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import CytoscapeViewer from './CytoscapeViewer'
import LGRPanel from './LGRPanel'
import CytoscapeRenderer from '../CytoscapeRenderer'
import AppContext from '../../context/AppState'
import useSearch from '../../hooks/useSearch'
import SplitPane from 'react-split-pane'
import SubnetworkView from './SubnetworkView'
import NavigationPanel from '../NavigationPanel'

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
  }),
)

const getEventHandlers = () => {}

const NetworkPanel = (props) => {
  const classes = useStyles()
  const { renderer } = props

  const appContext = useContext(AppContext)
  const { uuid, query, setSelectedEdges, setSelectedNodes, selectedNodes, selectedEdges, cy, setCy } = appContext

  const eventHandlers = {
    setSelectedEdges,
    setSelectedNodes,
  }

  const { status, data, error, isFetching } = useSearch(uuid, query, '')

  let nodeIds = []
  if (data !== undefined && !isFetching) {
    nodeIds = data.nodeIds
  }

  // console.log('**Network', props)
  let objectCount = 0
  // if (props['network'] !== undefined) {
  //   const network = props['network']
  //   console.log('**Network', network.elements)
  // }

  if (renderer === null) {
    return <div className={classes.root}>Loading...</div>
  }

  const width = window.innerWidth
  let defSize = 1

  if (selectedNodes.length !== 0) {
    defSize = Math.floor(width * 0.5)
  }

  return (
    <div className={classes.root} >
      <NavigationPanel />
      <SplitPane split="horizontal" defaultSize={defSize}>
        <div className={classes.subnet}>
          <SubnetworkView {...props} />
        </div>
        <div className={classes.root}>
          {renderer === 'lgr' ? (
            <LGRPanel {...props} />
          ) : (
            <CytoscapeRenderer cy={cy} setCy={setCy} eventHandlers={eventHandlers} selectedNodes={nodeIds} {...props} />
          )}
        </div>
      </SplitPane>
    </div>
  )
}

export default NetworkPanel
