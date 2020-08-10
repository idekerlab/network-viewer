import React, { useContext, useState } from 'react'
import AppContext from '../../context/AppState'
import useSearch from '../../hooks/useSearch'
import { useParams } from 'react-router-dom'
import BasicView from './BasicView'
// import SplitView from './SplitView'
import NewSplitView from './NewSplitView'

/**
 *
 * Basic panel for a network
 * It is ALWAYS show only one network with a unique UUID.
 *
 * @param props
 */
const NetworkPanel = ({ renderer, cx } ) => {

  return (
    <NewSplitView
      cx={cx}
      renderer={renderer}
    />
  )

  // if (searchResult.data === undefined || searchResult.data === {} || query === '') {
  //   return (
  //     <NewSplitView
  //       cx={cx}
  //       renderer={renderer}
  //       setCy={setCy}
  //       setSelectedEdges={setSelectedEdges}
  //       setSelectedNodes={setSelectedNodes}
  //     />
  //   )
  // } else {
  //   if (renderer === 'lgr') {
  //     // For large network, use highlight
  //     return (
  //       <BasicView
  //         cx={cx}
  //         renderer={renderer}
  //         subCx={searchResult.data.cx}
  //         setSelectedEdges={setSelectedEdges}
  //         setSelectedNodes={setSelectedNodes}
  //       />
  //     )
  //   } else {
  //     return <NewSplitView cx={cx} renderer={renderer} subCx={searchResult.data.cx} />
  //   }
  // }
}

export default NetworkPanel
