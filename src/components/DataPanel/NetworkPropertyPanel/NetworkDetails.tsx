import { Chip, createStyles, makeStyles, Theme, Tooltip } from '@material-ui/core'
import { Typography } from '@material-ui/core'
import WarningIcon from '@material-ui/icons/AnnouncementOutlined'
import ErrorIcon from '@material-ui/icons/ErrorOutline'
import React, { useContext, useRef, useState, useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import AppContext from '../../../context/AppState'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    networkDetails: {
      margin: theme.spacing(1),
    },
    item: {
      marginRight: theme.spacing(1),
    },
    label: {
      marginRight: theme.spacing(1),
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
      padding: theme.spacing(1),
    },
    warning: {
      color: 'deeppink',
    },
    error: {
      color: 'red',
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
  const { summary, uiState, config } = useContext(AppContext)
  const { viewerThreshold, warningThreshold } = config
  const [doiCopiedHoverText, setDoiCopiedHoverText] = useState(false)
  const copyRef = useRef(null)

  if (summary === undefined) {
    return null
  }
  const getInformationIcon = (objectCount: number) => {
    if (objectCount >= viewerThreshold && objectCount < warningThreshold) {
      return (
        <Tooltip arrow title="Large network loaded: showing network in simplified mode">
          <WarningIcon fontSize="large" className={classes.warning} />
        </Tooltip>
      )
    } else if (objectCount >= warningThreshold) {
      return (
        <Tooltip arrow title="Network is too large to display">
          <ErrorIcon fontSize="large" className={classes.error} />
        </Tooltip>
      )
    }
  }

  const copyDoi = () => {
    setDoiCopiedHoverText(true)
  }

  const mouseEnter = () => {
    setDoiCopiedHoverText(false)
  }

  return (
    <div className={classes.networkDetails}>
      {summary.doi ? (
        <div className={classes.buttonContainer}>
          {summary.doi === 'Pending' ? (
            <Chip label={'DOI: Pending'} size="small" variant="outlined" className={classes.item} />
          ) : (
            <Tooltip
              title={doiCopiedHoverText ? 'Copied!' : 'Copy network DOI to clipboard'}
              className={classes.item}
            >
              <CopyToClipboard text={summary.doi} onCopy={copyDoi}>
                <Chip
                  clickable
                  label={`DOI: ${summary.doi}`}
                  variant="outlined"
                  onClick={copyDoi}
                  onMouseEnter={mouseEnter}
                />
              </CopyToClipboard>
            </Tooltip>
          )}
        </div>
      ) : null}

      <div className={classes.row}>
        <Typography className={classes.label} variant="subtitle2">
          Network Size:
        </Typography>
        <Chip
          size="small"
          color="secondary"
          label={`Nodes: ${summary.nodeCount}`}
          variant="outlined"
          className={classes.item}
        />
        <Chip
          size="small"
          color="secondary"
          label={`Edges: ${summary.edgeCount}`}
          variant="outlined"
          className={classes.item}
        />
        {getInformationIcon(summary.edgeCount + summary.nodeCount)}
      </div>
      {uiState.showSearchResult ? (
        <div className={classes.row}>
          <Typography className={classes.label} variant="subtitle2">
            Query Result:
          </Typography>
          <Chip
            size="small"
            label={`Nodes: ${summary.subnetworkNodeCount}`}
            variant="outlined"
            className={classes.item}
          />
          <Chip
            size="small"
            label={`Edges: ${summary.subnetworkEdgeCount}`}
            variant="outlined"
            className={classes.item}
          />
        </div>
      ) : null}
    </div>
  )
}

export default NetworkDetails
