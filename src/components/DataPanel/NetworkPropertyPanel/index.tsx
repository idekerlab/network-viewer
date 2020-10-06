import React, { useContext, useRef } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
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
      paddingTop: theme.spacing(1),
      paddingLeft: theme.spacing(3),
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
      whiteSpace: 'nowrap',
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
      setSummary({
        ...summary,
        owner: summaryResponseData['owner'],
        externalId: summaryResponseData['externalId'],
        visibility: summaryResponseData['visibility'],
        nodeCount: summaryResponseData['nodeCount'],
        edgeCount: summaryResponseData['edgeCount'],
        properties: summaryResponseData['properties'],
        description: summaryResponseData['description'],
      })
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.topBar}>
        <MinimizeButton />
        <Typography variant="h5" className={classes.title}>
          {summaryResponseData['name']}
        </Typography>
      </div>
      <div className={classes.description}>
        <NetworkProperties />
      </div>
    </div>
  )
}

export default NetworkPropertyPanel
