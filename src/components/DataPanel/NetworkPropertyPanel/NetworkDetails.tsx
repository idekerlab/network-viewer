import { Button, createStyles, makeStyles, Theme } from '@material-ui/core'
import React, { useContext, useRef, useState, useEffect } from 'react'
import AppContext from '../../../context/AppState'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    networkDetails: {
      margin: theme.spacing(1),
    },
    subnetworkDetails: {
      marginTop: theme.spacing(1),
    },
    edgeButton: {
      marginLeft: theme.spacing(1),
    },
  }),
)

const NetworkDetails = () => {
  const classes = useStyles()
  const { summary, uiState } = useContext(AppContext)
  const nodeRef = useRef(null)
  const edgeRef = useRef(null)
  const [nodeWidth, setNodeWidth] = useState('')
  const [edgeWidth, setEdgeWidth] = useState('')

  useEffect(() => {
    if (uiState.showSearchResult && nodeRef.current !== null) {
      setNodeWidth(nodeRef.current.offsetWidth)
      setEdgeWidth(edgeRef.current.offsetWidth)
    }
  }, [uiState.showSearchResult])

  if (summary === undefined) {
    return null
  }

  return (
    <div className={classes.networkDetails}>
      <div>
        <Button disabled variant="outlined" ref={nodeRef}>
          Nodes: {summary.nodeCount}
        </Button>
        <Button disabled variant="outlined" ref={edgeRef} className={classes.edgeButton}>
          Edges: {summary.edgeCount}
        </Button>
      </div>
      {uiState.showSearchResult ? (
        <div className={classes.subnetworkDetails}>
          <Button disabled variant="outlined" style={{ width: nodeWidth }}>
            Nodes: {summary.subnetworkNodeCount}
          </Button>
          <Button disabled variant="outlined" style={{ width: edgeWidth }} className={classes.edgeButton}>
            Edges: {summary.subnetworkEdgeCount}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default NetworkDetails
