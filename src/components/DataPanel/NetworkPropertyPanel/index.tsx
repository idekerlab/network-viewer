import React, { useContext, FC } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import NetworkProperties from './NetworkProperties'
import useNetworkSummary from '../../../hooks/useNetworkSummary'
import { useParams } from 'react-router-dom'
import AppContext from '../../../context/AppState'
import NetworkDetails from './NetworkDetails'
import { NetworkPanelState } from '../index'
import QueryState from './QueryPanel/QueryState'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      overflowY: 'hidden',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      backgroundColor: theme.palette.background.paper,
    },
    description: {
      padding: 0,
      margin: 0,
      backgroundColor: 'inherit',
      height: '100%',
      overflowY: 'hidden',
    },
  }),
)

const NetworkPropertyPanel: FC<{
  cx: object
  panelState: NetworkPanelState
  setPanelState: (NetworkPanelState) => void
  queryState: QueryState
  setQueryState: (QueryState) => void
  renderer: string
}> = ({
  cx,
  panelState,
  setPanelState,
  queryState,
  setQueryState,
  renderer,
}) => {
  const classes = useStyles()
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
      summary === undefined ||
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
    <div className={classes.root}>
      <NetworkDetails
        cx={cx}
        panelState={panelState}
        setPanelState={setPanelState}
        queryState={queryState}
        setQueryState={setQueryState}
        renderer={renderer}
      />
      <div className={classes.description}>
        <NetworkProperties
          summary={summaryResponseData}
          panelState={panelState}
          setPanelState={setPanelState}
        />
      </div>
    </div>
  )
}

export default NetworkPropertyPanel
