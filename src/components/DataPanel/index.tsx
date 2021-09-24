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
import InformationPanel from './EntryTable/InformationPanel'
import WarningPanel from './EntryTable/WarningPanel'
import { getEntry, getNodeCount, getEdgeCount } from '../../utils/cxUtil'

let baseFontSize = null

const useStyles = makeStyles((theme: Theme) => {
  baseFontSize = theme.typography.fontSize

  return createStyles({
    root: {
      width: '100%',
      height: '100%',

      maxHeight: '100%',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      backgroundColor: theme.palette.background.paper,
      overflowY: 'hidden',
      borderLeft: `1px solid ${theme.palette.divider}`,
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
    tabWrapper: {
      boxSizing: 'border-box',
      backgroundColor: theme.palette.background.paper,
      margin: 0,
      padding: 0,
      width: '100%',
      height: '100%',
      overflowY: 'hidden',
      // border: '8px solid orange',
    },
    tabList: {
      boxSizing: 'border-box',
      padding: 0,
      margin: 0,
      minHeight: '3.1em',
      // borderBottom: `1px solid ${theme.palette.divider}`,

    },
    tab: {
      '&:disabled': {
        color: '#AAAAAA',
      },
    },
    collapsiblePanel: {
      minHeight: 'auto',
    },
  })
})

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

type GraphObjectCount = {
  nodeCount: number
  edgeCount: number
}

// Default threshold of selected nodes to be displayed in the table
const SELECTION_TH = 10000

const DataPanel: FC<{ width: number; cx: any[]; renderer: string }> = ({
  width,
  cx,
  renderer,
}): ReactElement => {
  const baseRef = useRef(null)
  const titleRef = useRef(null)
  const tabsRef = useRef(null)
  const classes = useStyles()

  const [objCount, setObjCount] = useState<GraphObjectCount>({
    nodeCount: 0,
    edgeCount: 0,
  })

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
  const [allNodeIds, setAllNodeIds] = useState<any[]>([])
  const [allEdgeIds, setAllEdgeIds] = useState<any[]>([])

  useEffect(() => {
    if (cx !== undefined && cx !== null && Array.isArray(cx) && cx.length > 0) {
      const allNodeCount = getNodeCount(cx)
      const allEdgeCount = getEdgeCount(cx)
      setObjCount({ nodeCount: allNodeCount, edgeCount: allEdgeCount })

      const allNodes = getEntry('nodes', cx)
      const allEdges = getEntry('edges', cx)

      if (
        allNodes !== undefined &&
        Array.isArray(allNodes) &&
        allNodes.length !== 0
      ) {
        const testNodeId = allNodes[0]['@id']
        const idTag = testNodeId === undefined ? 'id' : '@id'
        const allNodeIDs = allNodes.map((node) => node[idTag])
        setAllNodeIds(allNodeIDs)
      }
      if (
        allEdges !== undefined &&
        Array.isArray(allEdges) &&
        allEdges.length !== 0
      ) {
        const testEdgeId = allEdges[0]['@id']
        const idTag = testEdgeId === undefined ? 'id' : '@id'
        const allEdgeIds = allEdges.map((edge) => edge[idTag])
        setAllEdgeIds(allEdgeIds)
      }
    }
  }, [cx])

  useEffect(() => {
    const { main, sub } = selectionState
    if (
      main.nodes.length <= 1 &&
      main.edges.length <= 1 &&
      sub.nodes.length <= 1 &&
      sub.edges.length <=1
    ) {
      setSelected(TabType.Network)
      setTabsDisabled(true)
    } else {
      setTabsDisabled(false)
      setSelected(TabType.Node)
      setChanged(!changed)
    }

    // For populating the table with all the nodes
    if (main.nodes.length === 0 && objCount.nodeCount < SELECTION_TH) {
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

    //   // Show all nodes if number of nodes are smaller than threshold
    if (nodes.length === 0 && objCount.nodeCount < SELECTION_TH) {
      nodes = allNodeIds
    }
    if (edges.length === 0 && objCount.edgeCount < SELECTION_TH) {
      edges = allEdgeIds
    }
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

  const getTable = (selectedObjects: any[], type: string) => {
    if (selectedObjects.length === 0) {
      return (
        <InformationPanel
          type={type}
          count={type === 'node' ? objCount.nodeCount : objCount.edgeCount}
          threshold={SELECTION_TH}
        />
      )
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

  let nodeTabTitle =
    nodes.length === 0 || nodes.length === objCount.nodeCount
      ? ''
      : `(${nodes.length} selected)`
  let edgeTabTitle =
    edges.length === 0 || edges.length === objCount.edgeCount
      ? ''
      : `(${edges.length} selected)`

  return (
    <div className={classes.root} style={{ width: width }} ref={baseRef}>
      <div className={classes.topBar} ref={titleRef}>
        <MinimizeButton />
        <Typography variant="h5" className={classes.title}>
          {summaryResponseData['name']}
        </Typography>
      </div>

      <div className={classes.tabWrapper}>
        <Tabs
          selectedIndex={selected}
          forceRenderTabPanel={true}
          onSelect={_handleSelect}
        >
          <TabList className={classes.tabList} ref={tabsRef}>
            <Tab key={'network-tab'}>Network</Tab>
            <Tab key={'nodes-tab'}>
              <div>Nodes {nodeTabTitle}</div>
            </Tab>
            <Tab key={'edges-tab'}>
              <div>Edges {edgeTabTitle}</div>
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
    </div>
  )
}

export default DataPanel
