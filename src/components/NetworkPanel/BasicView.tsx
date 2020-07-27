import React, { useContext } from 'react'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import LGRPanel from './LGRPanel'
import CytoscapeRenderer from '../CytoscapeRenderer'
import AppContext from '../../context/AppState'
import { useParams } from 'react-router-dom'

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
  const { cx, renderer } = props

  const appContext = useContext(AppContext)
  const { setSelectedEdges, setSelectedNodes, selectedNodes, selectedEdges, cy, setCy } = appContext

  const eventHandlers = {
    setSelectedEdges,
    setSelectedNodes,
  }

  return (
    <div className={classes.root}>
      {renderer === 'lgr' ? (
        <LGRPanel cx={cx} eventHandlers={eventHandlers} selectedNodes={[]} />
      ) : (
        <CytoscapeRenderer
          id={'upper'}
          uuid={uuid}
          cx={cx}
          cy={cy}
          setCy={setCy}
          eventHandlers={eventHandlers}
          selectedNodes={[]}
          {...props}
        />
      )}
    </div>
  )
}

export default BasicView
