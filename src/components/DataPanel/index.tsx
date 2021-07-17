import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useContext,
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
import { Tooltip, Typography } from '@material-ui/core'
import MinimizeButton from './NetworkPropertyPanel/MinimizeButton'
import EntryTable from './EntryTable'
import QueryState, { DB } from './NetworkPropertyPanel/QueryPanel/QueryState'
import TargetNodes from './NetworkPropertyPanel/QueryPanel/TargetNodes'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

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
      boxSizing: 'border-box',
      backgroundColor: theme.palette.background.paper,
      margin: 0,
      padding: 0,
      height: '100%',
      width: '100%',
    },
    tab: {
      // minHeight: '2.6em',
      // minWidth: '7em',
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
  LGR_NODE: 'Multiple node selection for large networks is coming soon',
  LGR_EDGE: 'Multiple edge selection for large networks is coming soon',
}

// const TabPanel = (props) => {
//   const { children, value, index } = props
//   return value === index ? children : null
// }

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
      widths[letter] = baseFontSize
      // widths[letter] = getLetterWidth(sandbox, letter)
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
    <div className={classes.root} style={{ width: width }} ref={baseRef}>
      <div className={classes.topBar} ref={titleRef}>
        <MinimizeButton />
        <Typography variant="h5" className={classes.title}>
          {summaryResponseData['name']}
        </Typography>
      </div>

      <Tabs forceRenderTabPanel={true}>
        <TabList ref={tabsRef}>
          <Tab key={'network-tab'}>Network</Tab>
          <Tab key={'nodes-tab'}>Nodes ({nodes.length} selected)</Tab>
          <Tab key={'edges-tab'}>Edges ({edges.length} selected)</Tab>
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
          <EntryTable
            key={'selected-nodes'}
            selectedObjects={nodes}
            attributes={attributes.nodeAttr}
            context={context}
            letterWidths={letterWidths}
            label={'Name'}
            parentSize={size}
          />
        </TabPanel>
        <TabPanel value={selected} index={2}>
          <EntryTable
            key={'selected-edges'}
            selectedObjects={edges}
            attributes={attributes.edgeAttr}
            type={'edge'}
            context={context}
            letterWidths={letterWidths}
            label={'Name'}
            parentSize={size}
          />
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default DataPanel
