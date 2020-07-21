import React, { FC, useContext, useEffect, Suspense } from 'react'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
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
      backgroundColor: '#FF0000',
    },
  }),
)

const getEventHandlers = () => {}

const SubnetworkView = (props) => {
  const classes = useStyles()
  const { renderer } = props

  const appContext = useContext(AppContext)
  const { uuid, query, setSelectedEdges, setSelectedNodes, selectedNodes, selectedEdges } = appContext

  const eventHandlers = {
    setSelectedEdges,
    setSelectedNodes,
  }

  const { status, data, error, isFetching } = useSearch(uuid, query, '')


  if (data === undefined || isFetching) {
    return <div>N/A</div>
  }

  let network = data.cyjs

  console.log('New net::', network, data)
  
  if(network.network === null) {
    return <div>N/A</div>
    
  }

  return <CytoscapeRenderer eventHandlers={eventHandlers} selectedNodes={[]} {...network} />
}

export default SubnetworkView
