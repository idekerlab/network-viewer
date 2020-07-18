import React, { FC, useContext, useEffect, Suspense } from 'react'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import CytoscapeViewer from './CytoscapeViewer'
import LGRPanel from './LGRPanel'
import CytoscapeRenderer from '../CytoscapeRenderer'
import AppContext from '../../context/AppState'
import useSearch from '../../hooks/useSearch'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      backgroundColor: '#FFFFFF',
    },
  }),
)

const getEventHandlers = () => {}

const NetworkPanel: FC = (props) => {
  const classes = useStyles()

  const appContext = useContext(AppContext)
  const { uuid, query, setSelectedEdges, setSelectedNodes } = appContext

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
  if (props['network'] !== undefined) {
    const network = props['network']
    console.log('**Network', network.elements)
  }

  return (
    <div className={classes.root}>
      <Suspense fallback={<p>Loading...</p>}>
        {/* <CytoscapeViewer {...props} /> */}
        <LGRPanel {...props} />
        {/* <CytoscapeRenderer eventHandlers={eventHandlers} selectedNodes={nodeIds} {...props} /> */}
      </Suspense>
    </div>
  )
}

export default NetworkPanel
