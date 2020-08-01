import React, { useContext } from 'react'
import AppContext from '../../context/AppState'
import useSearch from '../../hooks/useSearch'
import { useParams } from 'react-router-dom'
import BasicView from './BasicView'
import SplitView from './SplitView'

const NetworkPanel = (props) => {
  const { uuid } = useParams()
  const { renderer, cx, setSelectedNodes, setSelectedEdges } = props
  const appContext = useContext(AppContext)
  const { query, queryMode, setCy } = appContext
  const searchResult = useSearch(uuid, query, '', queryMode)

  if (searchResult.data === undefined || searchResult.data === {} || query === '') {
    return (
      <BasicView
        cx={cx}
        renderer={renderer}
        setCy={setCy}
        setSelectedEdges={setSelectedEdges}
        setSelectedNodes={setSelectedNodes}
      />
    )
  } else {
    if (renderer === 'lgr') {
      // For large network, use highlight
      return (
        <BasicView
          cx={cx}
          renderer={renderer}
          subCx={searchResult.data.cx}
          setSelectedEdges={setSelectedEdges}
          setSelectedNodes={setSelectedNodes}
        />
      )
    } else {
      return <SplitView cx={cx} renderer={renderer} subCx={searchResult.data.cx} />
    }
  }
}

export default NetworkPanel
