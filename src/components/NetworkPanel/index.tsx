import React from 'react'
import NewSplitView from './NewSplitView'

/**
 *
 * Basic panel for a network
 * It is ALWAYS show only one network with a unique UUID.
 *
 * @param props
 */
const NetworkPanel = ({ renderer, cx, objectCount, height}) => (
  <NewSplitView cx={cx} renderer={renderer} objectCount={objectCount} height={height} />
)

export default NetworkPanel
