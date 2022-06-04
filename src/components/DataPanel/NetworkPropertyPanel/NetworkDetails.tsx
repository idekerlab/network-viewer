import React, { useContext, useState, FC } from 'react'
import {
  Chip,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Tooltip,
} from '@material-ui/core'
import { Typography } from '@material-ui/core'
import WarningIcon from '@material-ui/icons/AnnouncementOutlined'
import ErrorIcon from '@material-ui/icons/ErrorOutline'
import { useParams } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import AppContext from '../../../context/AppState'
import QueryPanel from './QueryPanel'
import DeleteDOIButton from '../../DeleteDOIButton'
import CollapsiblePanel from './CollapsiblePanel'
import { NetworkPanelState } from '..'
import QueryState from './QueryPanel/QueryState'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      margin: 0,
      paddingTop: theme.spacing(1),
    },
    item: {
      marginRight: theme.spacing(1),
    },
    label: {
      marginRight: theme.spacing(1),
      padding: 0,
      paddingLeft: theme.spacing(1),
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
    },
    grid: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    chip: {
      paddingLeft: theme.spacing(1),
    },
    warning: {
      color: theme.palette.warning.main,
    },
    error: {
      color: theme.palette.error.main,
    },
    copySpan: {
      display: 'none',
    },
    queryPanel: {},
  }),
)

const NetworkDetails: FC<{
  cx: any
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
  const { uuid } = useParams()
  const { summary, uiState, config } = useContext(AppContext)
  const { viewerThreshold, warningThreshold } = config
  const [doiCopiedHoverText, setDoiCopiedHoverText] = useState(false)

  const _handleQueryOpen = (val: boolean) => {
    setPanelState({ ...panelState, queryOpen: val })
  }

  if (summary === undefined || summary === null) {
    return null
  }

  const getInformationIcon = (objectCount: number) => {
    if (objectCount >= viewerThreshold && objectCount < warningThreshold) {
      return (
        <Tooltip
          arrow
          title="Large network loaded: showing network in simplified mode"
        >
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
    <div className={classes.root}>
      {summary.doi ? (
        <>
          {summary.doi === 'Pending' ? (
            <Grid className={classes.grid} container alignItems={'center'}>
              <Grid item>
                <DeleteDOIButton uuid={uuid} />{' '}
              </Grid>
              <Grid item>
                <Chip
                  variant={'outlined'}
                  label={'DOI Status: Pending'}
                  size={'small'}
                  color={'default'}
                />
              </Grid>
            </Grid>
          ) : (
            <div className={classes.chip}>
              <Tooltip
                title={
                  doiCopiedHoverText
                    ? 'Copied!'
                    : 'Copy network DOI to clipboard'
                }
                className={classes.item}
              >
                <CopyToClipboard
                  text={'https://doi.org/' + summary.doi}
                  onCopy={copyDoi}
                >
                  <Chip
                    clickable
                    label={`DOI: ${summary.doi}`}
                    size={'small'}
                    color={'default'}
                    variant="outlined"
                    onMouseEnter={mouseEnter}
                  />
                </CopyToClipboard>
              </Tooltip>
            </div>
          )}
        </>
      ) : null}

      <Grid container className={classes.grid}>
        <Typography className={classes.label} variant="body1">
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
      </Grid>

      {uiState.showSearchResult && summary.subnetworkNodeCount !== undefined ? (
        <Grid container className={classes.grid}>
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
        </Grid>
      ) : null}

      {renderer === 'lgr' && !uiState.showSearchResult ? (
        <div />
      ) : (
        <CollapsiblePanel
          openByDefault={false}
          title={
            !uiState.showSearchResult
              ? 'Query External Database'
              : 'Query External Database (for sub network)'
          }
          children={
            <QueryPanel
              cx={cx}
              queryState={queryState}
              setQueryState={setQueryState}
            />
          }
          open={panelState.queryOpen}
          setOpen={_handleQueryOpen}
          backgroundColor={'#f5f5f5'}
        />
      )}
    </div>
  )
}

export default NetworkDetails
