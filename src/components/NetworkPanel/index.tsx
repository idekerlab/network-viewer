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
  const { query, queryMode } = appContext
  const searchResult = useSearch(uuid, query, '', queryMode)

  if (searchResult.data === undefined) {
    return <BasicView cx={cx} renderer={renderer} />
  } else {
    return <SplitView cx={cx} renderer={renderer} subCx={searchResult.data.cx} />
  }
}

export default NetworkPanel
