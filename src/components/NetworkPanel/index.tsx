import React from 'react'
import NewSplitView from './NewSplitView'

/**
 *
 * Basic panel for a network
 * It is ALWAYS show only one network with a unique UUID.
 *
 * @param props
 */
const NetworkPanel = ({ renderer, cx }) => <NewSplitView cx={cx} renderer={renderer} />

export default NetworkPanel
