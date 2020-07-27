import React from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import NetworkPanel from '../NetworkPanel'
import DataPanel from '../DataPanel'
import SplitPane from 'react-split-pane'
import { useParams } from 'react-router-dom'
import FooterPanel from '../FooterPanel'
import useNetworkSummary from '../../hooks/useNetworkSummary'
import useCx from '../../hooks/useCx'
import { Typography } from '@material-ui/core'

const BASE_URL = 'http://dev.ndexbio.org/'
const V2 = 'v2'
const V3 = 'v3'

const RENDERER = {
  lgr: 'lgr',
  cyjs: 'cyjs',
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    base: {
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      flexGrow: 1,
    },
    leftPanel: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    initPanel: {
      height: '100%',
      color: '#AAAAAA',
      display: 'grid',
      placeItems: 'center',
    },
  }),
)
const MainSplitPane = () => {
  const classes = useStyles()
  const { uuid } = useParams()

  const width = window.innerWidth
  const defSize = Math.floor(width * 0.65)

  const result = useNetworkSummary(uuid, BASE_URL, V2)
  const summary = result.data

  let apiVersion = null
  let rend = null

  if (summary !== undefined && Object.keys(summary).length !== 0) {
    const count = summary['edgeCount'] + summary['nodeCount']
    if (count > 3000) {
      apiVersion = V3
      rend = RENDERER.lgr
    } else {
      apiVersion = V2
      rend = RENDERER.cyjs
    }
  }

  // const { status, data, error, isFetching } = useNetwork(uuid, BASE_URL, apiVersion)
  const cxResponse = useCx(uuid, BASE_URL, apiVersion)

  return (
    <SplitPane className={classes.base} split="vertical" minSize={150} defaultSize={defSize}>
      <div className={classes.leftPanel}>
        {cxResponse.data === undefined || cxResponse.isFetching || rend === null ? (
          <div className={classes.initPanel}>
            <Typography variant="h6">Initializing Viewer...</Typography>
          </div>
        ) : (
          <NetworkPanel cx={cxResponse.data} renderer={rend} />
        )}
        <FooterPanel />
      </div>
      <DataPanel uuid={uuid} cx={cxResponse.data}/>
    </SplitPane>
  )
}

export default MainSplitPane
