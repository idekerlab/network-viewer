import React, { useContext } from 'react'
import AppContext from '../../context/AppState'
import useSearch from '../../hooks/useSearch'
import { useParams } from 'react-router-dom'
import BasicView from './BasicView'
import SplitView from './SplitView'


const NetworkPanel = (props) => {
  const { uuid } = useParams()
  const { renderer, cx } = props
  const appContext = useContext(AppContext)
  const { query } = appContext
  const searchResult = useSearch(uuid, query, '')

  // No search result yet.  Display single network
  if(searchResult.data === undefined) {
    return <BasicView cx={cx} renderer={renderer} />
  } else {
    return <SplitView cx={cx} renderer={renderer} subCx={searchResult.data.cx} />
  }


  // const eventHandlers = {
  //   setSelectedEdges,
  //   setSelectedNodes,
  // }


  // const data = searchResult.data
  // console.log('* Query result ===', data, props)
  // let nodeIds = []
  // if (data !== undefined ) {
  //   nodeIds = data.nodeIds
  // }

  // if (renderer === null) {
  //   return <div className={classes.loading}></div>
  // }

  // const getRendererInstance = (renderer: string) => {
  //   if (renderer === 'lgr') {
  //     return <LGRPanel cx={cx} eventHandlers={eventHandlers} selectedNodes={nodeIds} {...props} />
  //   } else {
  //     return (
  //       <CytoscapeRenderer cx={cx} cy={cy} setCy={setCy} eventHandlers={eventHandlers} selectedNodes={nodeIds} {...props} />
  //     )
  //   }
  // }

  // const baseNetworkView = getRendererInstance(renderer)


  // const width = window.innerWidth
  // const defSize = Math.floor(width * 0.6)

  // console.log('########## base========', baseNetworkView)

  // return (
  //   <SplitPane className={classes.root} split="horizontal" defaultSize={defSize}>
  //     <div className={classes.subnet}>
  //       <CytoscapeRenderer cy={cy} setCy={setCy} eventHandlers={eventHandlers} selectedNodes={nodeIds} {...props} />
  //       {/* <SubnetworkView {...props} /> */}
  //     </div>
  //     <div className={classes.lowerPanel}>
  //       Lower 1upper
  //     </div>
  //   </SplitPane>
  // )
}

export default NetworkPanel
