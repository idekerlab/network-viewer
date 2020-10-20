import { Button, createStyles, makeStyles, Theme, Tooltip } from '@material-ui/core'
import React, { useContext, useRef, useState, useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import AppContext from '../../../context/AppState'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(0.5),
    },
    buttonContainer: {
      margin: theme.spacing(1),
    },
    copySpan: {
      display: 'none',
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
  const [doiCopiedHoverText, setDoiCopiedHoverText] = useState(false)
  const copyRef = useRef(null)

  useEffect(() => {
    if (uiState.showSearchResult && nodeRef.current !== null) {
      setNodeWidth(nodeRef.current.offsetWidth)
      setEdgeWidth(edgeRef.current.offsetWidth)
    }
  }, [uiState.showSearchResult])

  if (summary === undefined) {
    return null
  }

  const copyDoi = () => {
    setDoiCopiedHoverText(true)
  }

  const mouseEnter = () => {
    setDoiCopiedHoverText(false)
  }

  return (
    <div>
      {summary.doi ? (
        <div className={classes.buttonContainer}>
          {summary.doi === 'Pending' ? (
            <Button disabled variant="outlined" className={classes.button}>
              DOI: Pending
            </Button>
          ) : (
            <Tooltip
              title={doiCopiedHoverText ? 'Copied!' : 'Copy network DOI to clipboard'}
              className={classes.button}
            >
              <CopyToClipboard text={summary.doi} onCopy={copyDoi}>
                <Button variant="outlined" onClick={copyDoi} onMouseEnter={mouseEnter}>
                  DOI: {summary.doi}
                </Button>
              </CopyToClipboard>
            </Tooltip>
          )}
        </div>
      ) : null}

      <div className={classes.buttonContainer}>
        <Button disabled variant="outlined" ref={nodeRef} className={classes.button}>
          Nodes: {summary.nodeCount}
        </Button>
        <Button disabled variant="outlined" ref={edgeRef} className={classes.button}>
          Edges: {summary.edgeCount}
        </Button>
      </div>
      {uiState.showSearchResult ? (
        <div className={classes.buttonContainer}>
          <Button disabled variant="outlined" style={{ width: nodeWidth }} className={classes.button}>
            Nodes: {summary.subnetworkNodeCount}
          </Button>
          <Button disabled variant="outlined" style={{ width: edgeWidth }} className={classes.button}>
            Edges: {summary.subnetworkEdgeCount}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default NetworkDetails
