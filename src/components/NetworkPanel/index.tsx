import React, { useContext, useState } from 'react'
import AppContext from '../../context/AppState'
import useSearch from '../../hooks/useSearch'
import { useParams } from 'react-router-dom'
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
}

export default NetworkPanel
