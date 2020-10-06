import React, { useRef, useEffect, useContext, useState } from 'react'
import Button from '@material-ui/core/Button'
import PublicIcon from '@material-ui/icons/Public'
import VpnLockIcon from '@material-ui/icons/VpnLock'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

import AppContext from '../../../context/AppState'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    objectCount: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    countButton: {
      marginLeft: theme.spacing(1),
      whiteSpace: 'nowrap',
    },
    icon: {
      margin: theme.spacing(1),
      marginLeft: 0,
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    subObjectCount: {
      marginTop: theme.spacing(1),
    },
  }),
)

const NetworkInformation = () => {
  const classes = useStyles()
  const { summary, uiState } = useContext(AppContext)

  const nodeButton = useRef(null)
  const edgeButton = useRef(null)
  const [nodeWidth, setNodeWidth] = useState('')
  const [edgeWidth, setEdgeWidth] = useState('')

  useEffect(() => {
    console.log('yes')
    if (nodeButton.current !== null) {
      setNodeWidth(nodeButton.current.offsetWidth + 'px')
      setEdgeWidth(edgeButton.current.offsetWidth + 'px')
      console.log(nodeWidth)
      console.log(edgeWidth)
    }
  }, [summary])

  return (
    <div className={classes.objectCount}>
      <div className={classes.iconContainer}>
        {summary.visibility === 'PUBLIC' ? (
          <PublicIcon className={classes.icon} />
        ) : (
          <VpnLockIcon className={classes.icon} />
        )}
      </div>
      <div>
        <div>
          <Button disabled className={classes.countButton} variant="outlined" ref={nodeButton}>
            Nodes: {summary.nodeCount}
          </Button>
          <Button disabled className={classes.countButton} variant="outlined" ref={edgeButton}>
            Edges: {summary.edgeCount}
          </Button>
        </div>

        {uiState.showSearchResult ? (
          <div className={classes.subObjectCount}>
            <Button disabled className={classes.countButton} variant="outlined" style={{ width: nodeWidth }}>
              Nodes: {summary.subnetworkNodeCount}
            </Button>
            <Button disabled className={classes.countButton} variant="outlined" style={{ width: edgeWidth }}>
              Edges: {summary.subnetworkEdgeCount}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default NetworkInformation
