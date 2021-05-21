import React, {
  useState,
  useMemo,
  useContext,
  useEffect,
  FC,
  ReactElement,
} from 'react'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import NetworkPropertyPanel from './NetworkPropertyPanel'
import { useParams } from 'react-router-dom'
import AppContext from '../../context/AppState'
import useAttributes from '../../hooks/useAttributes'
import { getContextFromCx } from '../../utils/contextUtil'
import useNetworkSummary from '../../hooks/useNetworkSummary'
import { Tab, Tabs, Tooltip, Typography } from '@material-ui/core'
import MinimizeButton from './NetworkPropertyPanel/MinimizeButton'
import EntryTable from './EntryTable'
import QueryState, { DB } from './NetworkPropertyPanel/QueryPanel/QueryState'
import TargetNodes from './NetworkPropertyPanel/QueryPanel/TargetNodes'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      borderBottom: '1px solid rgba(220,220,220,0.7)',
      backgroundColor: '#FEFEFE',
    },
    topBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingRight: theme.spacing(1),
    },
    title: {
      paddingTop: theme.spacing(1),
      paddingLeft: theme.spacing(3),
    },
    tabs: {
      marginTop: theme.spacing(1),
      minHeight: '2.6em',
      backgroundColor: theme.palette.background.paper,
      borderTop: `2px solid ${theme.palette.background.default}`,
      borderBottom: `1px solid ${theme.palette.background.default}`,
    },
    tab: {
      minHeight: '2.6em',
      minWidth: '7em',
      '&:disabled': {
        color: '#AAAAAA',
      },
    },
    collapsiblePanel: {
      minHeight: 'auto',
    },
  }),
)

const TOOLTIP_MESSAGE = {
  CYJS_NODE: 'Select multiple nodes to view in node table',
  CYJS_EDGE: 'Select multiple edges to view in edge table',
  LGR_NODE: 'Multiple node selection for large networks is coming soon',
  LGR_EDGE: 'Multiple edge selection for large networks is coming soon',
}

const TabPanel = (props) => {
  const { children, value, index } = props
  return value === index ? children : null
}

export type NetworkPanelState = {
  netInfoOpen: boolean
  descriptionOpen: boolean
  propsOpen: boolean
  queryOpen: boolean
}

const DEF_QUERY_STATE: QueryState = {
  db: DB.IQUERY,
  column: 'name',
  target: TargetNodes.All,
}

const DataPanel: FC<{ width: number; cx: any[]; renderer: string }> = ({
  width,
  cx,
  renderer,
}): ReactElement => {
  const classes = useStyles()

  const { ndexCredential, config, selectionState, uiState } = useContext(
    AppContext,
  )

  const { showSearchResult } = uiState

  const { uuid } = useParams()

  const attributes = useAttributes(uuid, cx, uiState.mainNetworkNotDisplayed)
  const context = useMemo(() => getContextFromCx(cx), [cx])

  // Selected tab
  const [selected, setSelected] = useState(0)

  // Unified child panel states
  const [panelState, setPanelState] = useState<NetworkPanelState>({
    netInfoOpen: true,
    descriptionOpen: true,
    propsOpen: true,
    queryOpen: false,
  })

  // Store state of the query settings
  const [queryState, setQueryState] = useState<QueryState>(DEF_QUERY_STATE)

  const handleChange = (event, newValue) => {
    // setActiveTab({ ...uiState, activeTab: newValue })
    setSelected(newValue)
  }

  const getLetterWidth = (sandbox, letter) => {
    sandbox.innerHTML = `<span>${letter}</span>`
    const el = sandbox.children[0]
    return el.offsetWidth
  }

  const letterWidths = useMemo(() => {
    const widths = {}
    let widthSum = 0
    const sandbox = document.getElementById('sandbox')
    sandbox.style.display = 'block'
    for (let i = 32; i < 127; i++) {
      let letter = String.fromCharCode(i)
      if (letter === ' ') {
        letter = '&nbsp'
      }
      widths[letter] = getLetterWidth(sandbox, letter)
      widthSum += widths[letter]
    }
    sandbox.style.display = 'none'
    widths['default'] = widthSum / (127 - 32)
    return widths
  }, [])

  let nodes = []
  let edges = []
  if (!showSearchResult) {
    // Main view only
    // if (selectionState.lastSelected.fromMain) {
    nodes = selectionState.main['nodes']
    edges = selectionState.main['edges']
  } else {
    nodes = selectionState.sub['nodes']
    edges = selectionState.sub['edges']
  }

  const summaryResponse = useNetworkSummary(
    uuid,
    config.ndexHttps,
    'v2',
    ndexCredential,
  )
  const summaryResponseData = summaryResponse.data

  return (
    <div className={classes.root} style={{ width: width }}>
      <div className={classes.topBar}>
        <MinimizeButton />
        <Typography variant="h5" className={classes.title}>
          {summaryResponseData['name']}
        </Typography>
      </div>
      <Tabs
        value={selected}
        onChange={handleChange}
        scrollButtons="auto"
        variant="scrollable"
        className={classes.tabs}
      >
        <Tab className={classes.tab} key={'network-tab'} label={'Network'} />
        {(renderer !== 'lgr' || showSearchResult) && nodes.length > 1 ? (
          <Tab className={classes.tab} key={'nodes-tab'} label={'Nodes'} />
        ) : (
          <Tooltip
            title={
              renderer === 'lgr'
                ? TOOLTIP_MESSAGE.LGR_NODE
                : TOOLTIP_MESSAGE.CYJS_NODE
            }
            arrow
          >
            <span>
              <Tab
                className={classes.tab}
                key={'nodes-tab'}
                label={'Nodes'}
                disabled
              />
            </span>
          </Tooltip>
        )}
        {(renderer !== 'lgr' || showSearchResult) && edges.length > 1 ? (
          <Tab className={classes.tab} key={'edges-tab'} label={'Edges'} />
        ) : (
          <Tooltip
            title={
              renderer === 'lgr'
                ? TOOLTIP_MESSAGE.LGR_EDGE
                : TOOLTIP_MESSAGE.CYJS_EDGE
            }
            arrow
          >
            <span>
              <Tab
                className={classes.tab}
                key={'edges-tab'}
                label={'Edges'}
                disabled
              />
            </span>
          </Tooltip>
        )}
        )
      </Tabs>

      <TabPanel value={selected} index={0}>
        <NetworkPropertyPanel
          cx={cx}
          panelState={panelState}
          setPanelState={setPanelState}
          queryState={queryState}
          setQueryState={setQueryState}
          renderer={renderer}
        />
      </TabPanel>

      {(renderer !== 'lgr' || showSearchResult) && nodes.length > 1 ? (
        <TabPanel value={selected} index={1}>
          <EntryTable
            key={'selected-nodes'}
            selectedObjects={nodes}
            attributes={attributes.nodeAttr}
            context={context}
            letterWidths={letterWidths}
            label={'Name'}
          />
        </TabPanel>
      ) : null}
      {(renderer !== 'lgr' || showSearchResult) && edges.length > 1 ? (
        <TabPanel value={selected} index={2}>
          <EntryTable
            key={'selected-edges'}
            selectedObjects={edges}
            attributes={attributes.edgeAttr}
            type={'edge'}
            context={context}
            letterWidths={letterWidths}
            label={'Name'}
          />
        </TabPanel>
      ) : null}
    </div>
  )
}

export default DataPanel
