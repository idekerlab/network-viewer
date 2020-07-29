import React, { useContext } from 'react'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import LGRPanel from './LGRPanel'
import CytoscapeRenderer from '../CytoscapeRenderer'
import AppContext from '../../context/AppState'
import { useParams } from 'react-router-dom'

import { getEntry } from '../../utils/cxUtil'
import useHighlight from '../../hooks/useHighlights'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      backgroundColor: '#FFFFFF',
    },
  }),
)

/**
 * Basic Network View without query result
 */
const BasicView = (props) => {
  const { uuid } = useParams()
  const classes = useStyles()
  const { cx, subCx, renderer } = props
  const targets = useHighlight(uuid, subCx)
  console.log('HL', targets)

  const appContext = useContext(AppContext)
  const { setSelectedEdges, setSelectedNodes, selectedNodes, selectedEdges, setCy } = appContext

  const eventHandlers = {
    setSelectedEdges,
    setSelectedNodes,
  }

  return (
    <div className={classes.root}>
      {renderer === 'lgr' ? (
        <LGRPanel highlight={targets} cx={cx} eventHandlers={eventHandlers} selectedNodes={selectedNodes} selectedEdges={selectedEdges} />
      ) : (
        <CytoscapeRenderer
          id={'upper'}
          uuid={uuid}
          cx={cx}
          setCy={setCy}
          eventHandlers={eventHandlers}
          selectedNodes={selectedNodes}
          {...props}
        />
      )}
    </div>
  )
}

const highlight = (subCx: object[]) => {
  const nodes = getEntry('nodes', subCx)
  console.log('HL nodes', nodes, subCx)
  return nodes.map((node: object) => node['@id'])
}

export default BasicView
