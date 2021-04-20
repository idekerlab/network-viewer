import React, { useContext } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import NetworkProperties from './NetworkProperties.jsx'
import useNetworkSummary from '../../../hooks/useNetworkSummary'
import { useParams } from 'react-router-dom'
import AppContext from '../../../context/AppState'
import NetworkDetails from './NetworkDetails'

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
    description: {
      padding: 0,
      margin: 0,
      backgroundColor: '#EEEEEE',
    },
  }),
)

const NetworkPropertyPanel = (props) => {
  const classes = useStyles()
  const { cx } = props
  const { ndexCredential, config, setSummary, summary } = useContext(AppContext)
  const { uuid } = useParams()

  const summaryResponse = useNetworkSummary(
    uuid,
    config.ndexHttps,
    'v2',
    ndexCredential,
  )
  const summaryResponseData = summaryResponse.data

  if (
    summaryResponseData === undefined ||
    Object.entries(summaryResponseData).length === 0
  ) {
    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item md={12}></Grid>
        </Grid>
      </div>
    )
  } else {
    if (
      summary == undefined ||
      summary.owner !== summaryResponseData['owner']
    ) {
      setSummary({
        ...summary,
        name: summaryResponseData['name'],
        owner: summaryResponseData['owner'],
        externalId: summaryResponseData['externalId'],
        visibility: summaryResponseData['visibility'],
        nodeCount: summaryResponseData['nodeCount'],
        edgeCount: summaryResponseData['edgeCount'],
        doi: summaryResponseData['doi'],
      })
    }
  }

  return (
    <>
      <NetworkDetails cx={cx} />
      <div className={classes.description}>
        <NetworkProperties summary={summaryResponseData} />
      </div>
    </>
  )
}

export default NetworkPropertyPanel
