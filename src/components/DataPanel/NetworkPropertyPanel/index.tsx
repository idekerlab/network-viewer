import React, { useContext, useRef } from 'react'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import DescriptionEditor from './DescriptionEditor'
import Button from '@material-ui/core/Button'
import PublicIcon from '@material-ui/icons/Public'
import VpnLockIcon from '@material-ui/icons/VpnLock'
import PropertyTable from './PropertyTable'
import NetworkProperties from './NetworkProperties.jsx'
import useNetworkSummary from '../../../hooks/useNetworkSummary'
import { useParams } from 'react-router-dom'
import MinimizeButton from './MinimizeButton'
import AppContext from '../../../context/AppState'

const API_VER = 'v2'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      overflowY: 'auto',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      borderBottom: '1px solid rgba(220,220,220,0.7)',
    },
    topBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      paddingRight: theme.spacing(1),
    },
    objectCount: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      //width: '100%',
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    title: {
      // width: '50%',
      paddingLeft: theme.spacing(1),
    },
    editor: {
      position: 'relative',
      padding: 0,
    },
    propTable: {
      width: '100%',
      padding: 0,
      margin: 0,
    },
    countButton: {
      marginLeft: theme.spacing(1),
    },
    description: {
      padding: 0,
      margin: 0,
      backgroundColor: '#EEEEEE',
    },
    label: {
      backgroundColor: '#EEEEEE',
      // paddingTop: theme.spacing(1),
      margin: 0,
      marginLeft: '0.7em',
      paddingBottom: 0,
    },
    icon: { margin: '12px' },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    subObjectCount: {
      marginTop: theme.spacing(1),
    },
  }),
)

const NetworkPropertyPanel = () => {
  const classes = useStyles()
  const { uuid } = useParams()
  const { ndexCredential, config, setSummary, summary, uiState } = useContext(AppContext)
  const nodeButton = useRef(null)
  const edgeButton = useRef(null)

  let nodeWidth = 0
  let edgeWidth = 0

  if (nodeButton.current !== null) {
    nodeWidth = nodeButton.current.offsetWidth
    edgeWidth = edgeButton.current.offsetWidth
  }

  const summaryResponse = useNetworkSummary(uuid, config.ndexHttps, 'v2', ndexCredential)
  const summaryResponseData = summaryResponse.data

  if (summaryResponseData === undefined || Object.entries(summaryResponseData).length === 0) {
    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item md={12}></Grid>
        </Grid>
      </div>
    )
  } else {
    if (summary == undefined || summary.owner !== summaryResponseData['owner']) {
      setSummary({ ...summary, owner: summaryResponseData['owner'], externalId: summaryResponseData['externalId'] })
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.topBar}>
        <MinimizeButton />
        <Typography className={classes.title}>{summaryResponseData['name']}</Typography>
      </div>
      <div className={classes.objectCount}>
        <div className={classes.iconContainer}>
          {summaryResponseData.visibility === 'PUBLIC' ? (
            <PublicIcon className={classes.icon} />
          ) : (
            <VpnLockIcon className={classes.icon} />
          )}
        </div>
        <div>
          <div>
            <Button disabled className={classes.countButton} variant="outlined" ref={nodeButton}>
              Nodes: {summaryResponseData['nodeCount']}
            </Button>
            <Button disabled className={classes.countButton} variant="outlined" ref={edgeButton}>
              Edges: {summaryResponseData['edgeCount']}
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
      <div className={classes.description}>
        <NetworkProperties summary={summaryResponseData} />
      </div>
    </div>
  )
}

export default NetworkPropertyPanel
