import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useContext,
  FC,
  ReactElement,
} from 'react'

import { Typography, Tooltip } from '@material-ui/core'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import NetworkPropertyPanel from './NetworkPropertyPanel'
import { useParams } from 'react-router-dom'
import AppContext from '../../context/AppState'
import useAttributes from '../../hooks/useAttributes'
import { getContextFromCx } from '../../utils/contextUtil'
import useNetworkSummary from '../../hooks/useNetworkSummary'
import MinimizeButton from './NetworkPropertyPanel/MinimizeButton'
import EntryTable from './EntryTable'
import QueryState, { DB } from './NetworkPropertyPanel/QueryPanel/QueryState'
import TargetNodes from './NetworkPropertyPanel/QueryPanel/TargetNodes'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import EmptyPanel from './EntryTable/EmptyPanel'
import WarningPanel from './EntryTable/WarningPanel'

let baseFontSize = null

const useStyles = makeStyles((theme: Theme) => {
  baseFontSize = theme.typography.fontSize

  return createStyles({
    root: {
      width: '100%',
      height: '100%',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      backgroundColor: theme.palette.background.paper,
    },
    topBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingRight: theme.spacing(1),
      border: `1px solid ${theme.palette.divider}`,
    },
    title: {
      paddingTop: theme.spacing(1.5),
      paddingBottom: theme.spacing(1.5),
      paddingLeft: theme.spacing(3),
    },
    tabs: {
      boxSizing: 'border-box',
      backgroundColor: theme.palette.background.paper,
      margin: 0,
      padding: 0,
      height: '100%',
      width: '100%',
    },
    tab: {
      '&:disabled': {
        color: '#AAAAAA',
      },
    },
    tabPanel: {
      width: '100%',
      height: '100%',
    },
    collapsiblePanel: {
      minHeight: 'auto',
    },
  })
})

const TOOLTIP_MESSAGE = {
  CYJS_NODE: 'Select multiple nodes to view in node table',
  CYJS_EDGE: 'Select multiple edges to view in edge table',
}

enum TabType {
  Network,
  Node,
  Edge,
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
  const baseRef = useRef(null)
  const titleRef = useRef(null)
  const tabsRef = useRef(null)
  const classes = useStyles()

  const [size, setSize] = useState<[number, number]>([0, 0])
  const [changed, setChanged] = useState<boolean>(false)

  const { ndexCredential, config, selectionState, uiState } = useContext(
    AppContext,
  )

  useEffect(() => {
    if (baseRef.current && titleRef.current) {
      let baseHeight =
        baseRef.current.offsetHeight - titleRef.current.offsetHeight
      let baseWidth = baseRef.current.offsetWidth
      setSize([baseWidth, baseHeight])
    }
  }, [baseRef, titleRef, tabsRef, selectionState])

  const { showSearchResult } = uiState

  const { uuid } = useParams()

  const attributes = useAttributes(uuid, cx, uiState.mainNetworkNotDisplayed)
  const context = useMemo(() => getContextFromCx(cx), [cx])

  // Selected tab
  const [selected, setSelected] = useState<TabType>(TabType.Network)

  //
  const [tabsDisabled, setTabsDisabled] = useState<boolean>(true)

  useEffect(() => {
    const { main, sub } = selectionState
    if (
      main.nodes.length === 0 &&
      main.edges.length === 0 &&
      sub.nodes.length === 0 &&
      sub.edges.length === 0
    ) {
      setSelected(TabType.Network)
      setTabsDisabled(true)
    } else {
      setTabsDisabled(false)
      setSelected(TabType.Node)
      setChanged(!changed)
    }
  }, [selectionState])

  // Unified child panel states
  const [panelState, setPanelState] = useState<NetworkPanelState>({
    netInfoOpen: true,
    descriptionOpen: true,
    propsOpen: true,
    queryOpen: false,
  })

  // Store state of the query settings
  const [queryState, setQueryState] = useState<QueryState>(DEF_QUERY_STATE)

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
      widths[letter] = baseFontSize
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

  const _handleSelect = (index, lastIndex, event) => {
    setChanged(!changed)
    setSelected(index)
  }

  const SELECTION_TH = 10000
  const getTable = (selectedObjects: any[], type: string) => {
    if (selectedObjects.length === 0) {
      return <EmptyPanel type={type} />
    } else if (selectedObjects.length > SELECTION_TH) {
      return <WarningPanel type={type} selectedCount={selectedObjects.length} />
    }

    if (type === 'node') {
      return (
        <EntryTable
          key={'selected-nodes'}
          selectedObjects={selectedObjects}
          attributes={attributes.nodeAttr}
          context={context}
          letterWidths={letterWidths}
          label={'Name'}
          parentSize={size}
          selected={changed}
        />
      )
    } else {
      return (
        <EntryTable
          key={'selected-edges'}
          selectedObjects={edges}
          attributes={attributes.edgeAttr}
          type={'edge'}
          context={context}
          letterWidths={letterWidths}
          label={'Name'}
          parentSize={size}
          selected={changed}
        />
      )
    }
  }

  return (
    <div className={classes.root} style={{ width: width }} ref={baseRef}>
      <div className={classes.topBar} ref={titleRef}>
        <MinimizeButton />
        <Typography variant="h5" className={classes.title}>
          {summaryResponseData['name']}
        </Typography>
      </div>

      <Tabs
        selectedIndex={selected}
        forceRenderTabPanel={true}
        onSelect={_handleSelect}
      >
        <TabList ref={tabsRef}>
          <Tab key={'network-tab'}>Network</Tab>
          <Tab disabled={tabsDisabled} key={'nodes-tab'}>
            <Tooltip
              title={selected !== TabType.Node ? TOOLTIP_MESSAGE.CYJS_NODE : ''}
            >
              <div>Nodes ({nodes.length} selected)</div>
            </Tooltip>
          </Tab>
          <Tab disabled={tabsDisabled} key={'edges-tab'}>
            <Tooltip
              title={selected !== TabType.Edge ? TOOLTIP_MESSAGE.CYJS_EDGE : ''}
            >
              <div>Edges ({edges.length} selected)</div>
            </Tooltip>
          </Tab>
        </TabList>

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

        <TabPanel value={selected} index={1}>
          {getTable(nodes, 'node')}
        </TabPanel>
        <TabPanel value={selected} index={2}>
          {getTable(edges, 'edge')}
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default DataPanel
