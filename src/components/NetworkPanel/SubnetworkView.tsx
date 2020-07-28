import React, { FC, useContext, useEffect, Suspense } from 'react'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import CytoscapeRenderer from '../CytoscapeRenderer'
import AppContext from '../../context/AppState'
import useSearch from '../../hooks/useSearch'
import Loading from './Loading'

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


const SubnetworkView = (props) => {
  const classes = useStyles()

  const appContext = useContext(AppContext)
  const { uuid, query, queryMode, setSelectedEdges, setSelectedNodes, selectedNodes, selectedEdges } = appContext

  const eventHandlers = {
    setSelectedEdges,
    setSelectedNodes,
  }

  const { status, data, error, isFetching } = useSearch(uuid, query, '', queryMode)


  if (data === undefined || isFetching) {
    // No result
    return <Loading message={"Loading search result..."} />
  }

  let subnetwork = data
  console.log('New net::', subnetwork, data)
  
  if(subnetwork === null || subnetwork === undefined ) {
    return <Loading message={"Loading search result..."} />
  }


  return <div className={classes.subnet} >OK!!!!!!!!!!!</div>
  // return <CytoscapeRenderer eventHandlers={eventHandlers} selectedNodes={[]} {...subnetwork} />
}

export default SubnetworkView
