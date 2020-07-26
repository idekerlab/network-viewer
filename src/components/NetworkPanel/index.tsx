import React, { useContext } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import LGRPanel from './LGRPanel'
import CytoscapeRenderer from '../CytoscapeRenderer'
import AppContext from '../../context/AppState'
import useSearch from '../../hooks/useSearch'
import SplitPane from 'react-split-pane'
import { useParams } from 'react-router-dom'
import BasicView from './BasicView'

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

const NetworkPanel = (props) => {
  const classes = useStyles()
  const { uuid } = useParams()
  const { renderer, cx } = props
  const appContext = useContext(AppContext)
  const { query, setSelectedEdges, setSelectedNodes, cy, setCy } = appContext
  const searchResult = useSearch(uuid, query, '')

  // No search result yet.  Display single network
  if(searchResult.data === undefined) {
    return <BasicView cx={cx} renderer={renderer} />
  }


  const eventHandlers = {
    setSelectedEdges,
    setSelectedNodes,
  }


  const data = searchResult.data
  console.log('* Query result ===', data, props)
  let nodeIds = []
  if (data !== undefined ) {
    nodeIds = data.nodeIds
  }

  if (renderer === null) {
    return <div className={classes.loading}></div>
  }

  const getRendererInstance = (renderer: string) => {
    if (renderer === 'lgr') {
      return <LGRPanel cx={cx} eventHandlers={eventHandlers} selectedNodes={nodeIds} {...props} />
    } else {
      return (
        <CytoscapeRenderer cx={cx} cy={cy} setCy={setCy} eventHandlers={eventHandlers} selectedNodes={nodeIds} {...props} />
      )
    }
  }

  const baseNetworkView = getRendererInstance(renderer)


  const width = window.innerWidth
  const defSize = Math.floor(width * 0.6)

  console.log('########## base========', baseNetworkView)

  return (
    <SplitPane className={classes.root} split="horizontal" defaultSize={defSize}>
      <div className={classes.subnet}>
        <CytoscapeRenderer cy={cy} setCy={setCy} eventHandlers={eventHandlers} selectedNodes={nodeIds} {...props} />
        {/* <SubnetworkView {...props} /> */}
      </div>
      <div className={classes.lowerPanel}>
        Lower 1upper
      </div>
    </SplitPane>
  )
}

export default NetworkPanel
