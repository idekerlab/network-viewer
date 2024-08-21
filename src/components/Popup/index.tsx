import React, { useContext, useState, useEffect, FC, useMemo } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { useParams } from 'react-router-dom'
import AppContext from '../../context/AppState'
import useAttributes from '../../hooks/useAttributes'
import PropertyPanel from '../PropertyPanel'
import {
  getContextFromCx,
  processList,
  processItem,
  processInternalLink,
} from '../../utils/contextUtil'
import { SelectionActions } from '../../reducer/selectionStateReducer'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      maxWidth: '40vh',
      maxHeight: '50vh',
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      border: '1px solid #999999',
      zIndex: 200,
      padding: '1em',
      paddingTop: 0,
      overflowY: 'auto',
      background:
        'linear-gradient(#ffffff 33%, rgba(255,255,255, 0)),linear-gradient(rgba(255,255,255, 0), #ffffff 66%) 0 100%,radial-gradient(farthest-side at 50% 0, rgba(89,89,89, 0.5), rgba(0,0,0,0)),radial-gradient(farthest-side at 50% 100%, rgba(89,89,89, 0.5), rgba(0,0,0,0)) 0 100%',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'local, local, scroll, scroll',
      backgroundSize: '100% 60px, 100% 60px, 100% 20px, 100% 20px',
    },
  }),
)

const EdgeAttributes = {
  SOURCE: 'source',
  TARGET: 'target',
  INTERACTION: 'interaction',
}

const Attributes = {
  NAME: 'name',
  NDEX_INTERNAL_LINK: 'ndex:internalLink',
}

type PopupProps = {
  cx: object[]
  subHeight: number
}

const FOOTER_HEIGHT = 60

const Popup: FC<PopupProps> = ({ cx, subHeight }: PopupProps) => {
  const classes = useStyles()
  const { uuid } = useParams()
  const { uiState, selectionState, selectionStateDispatch, config } =
    useContext(AppContext)
  const { windowHeight, windowWidth } = useWindowDimensions()

  const attr = useAttributes(uuid, cx, uiState.mainNetworkNotDisplayed)
  const context = useMemo(() => getContextFromCx(cx), [cx])

  const { lastSelected } = selectionState

  const setShowPropPanelFalse = () =>
    selectionStateDispatch({ type: SelectionActions.CLOSE_PROP_PANEL })

  const onClose = () => {
    setShowPropPanelFalse()
  }

  useEffect(() => {
    setShowPropPanelFalse()
  }, [uiState.showSearchResult])

  const isMultipleSelection = (selectionState): boolean => {
    const { main, sub } = selectionState
    const sumMain = main.nodes.length + main.edges.length
    const sumSub = sub.nodes.length + sub.edges.length

    if (sumMain > 1 || sumSub > 1) {
      return true
    } else {
      return false
    }
  }
  if (
    cx === undefined ||
    !lastSelected.showPropPanel ||
    selectionState.lastSelected.id === null ||
    isMultipleSelection(selectionState)
  ) {
    return <div />
  }

  const id = selectionState.lastSelected.id
  const isNode = selectionState.lastSelected.isNode

  let attrMap = null
  if (isNode) {
    attrMap = attr.nodeAttr[id]
  } else {
    attrMap = attr.edgeAttr[id]
  }

  // Process attrMap to only display non-empty fields and properly display links and lists
  const nonEmptyMap = new Map()
  let source, target, interaction
  let noNameEdge = true
  const include = []

  for (let item of attrMap) {
    if (!isNode) {
      if (
        [
          EdgeAttributes.SOURCE,
          EdgeAttributes.TARGET,
          EdgeAttributes.INTERACTION,
        ].includes(item[0])
      ) {
        if (item[0] === EdgeAttributes.SOURCE) {
          source = item[1]
        } else if (item[0] === EdgeAttributes.TARGET) {
          target = item[1]
        } else {
          interaction = item[1]
        }
        continue
      } else if (item[0] === Attributes.NAME) {
        noNameEdge = false
      }
    } else {
      noNameEdge = false
    }

    if (Array.isArray(item[1])) {
      for (let arrayItem of item[1]) {
        if (arrayItem !== undefined && arrayItem !== '') {
          include.push(item)
          break
        }
      }
    } else {
      if (item[1] !== undefined && item[1] !== '') {
        include.push(item)
      }
    }
  }

  include.sort((a, b) => {
    return a[0].localeCompare(b[0])
  })

  for (let item of include) {
    let value
    if (Array.isArray(item[1])) {
      value = processList(item[1], context)
    } else {
      if (item[0] === Attributes.NDEX_INTERNAL_LINK) {
        value = processInternalLink(item[1], config.ndexUrl)
      } else {
        value = processItem(item[1], context, true)
      }
    }
    nonEmptyMap.set(item[0], value)
  }

  if (noNameEdge) {
    if (source && target) {
      if (interaction) {
        nonEmptyMap.set(
          Attributes.NAME,
          source + ' (' + interaction + ') ' + target,
        )
      } else {
        nonEmptyMap.set(Attributes.NAME, source + ' (-) ' + target)
      }
    }
  }

  // Add source and target to the list if those are available in the original attr
  if (source) {
    nonEmptyMap.set(EdgeAttributes.SOURCE, source)
  }
  if (target) {
    nonEmptyMap.set(EdgeAttributes.TARGET, target)
  }
  if (interaction) {
    nonEmptyMap.set(EdgeAttributes.INTERACTION, interaction)
  }

  //Calculate position based on pointer position in window
  const x = lastSelected.coordinates.x
  const y = lastSelected.coordinates.y

  //Left or right?
  let right = true
  if (x > (windowWidth - uiState.rightPanelWidth) / 2) {
    right = false
  }

  //Bottom or top?
  let bottom = true
  if (selectionState.lastSelected.fromMain) {
    if (y > (windowHeight - FOOTER_HEIGHT) / 2) {
      bottom = false
    }
  } else {
    if (windowHeight - subHeight + y > windowHeight / 2) {
      bottom = false
    }
  }

  const style = {
    maxHeight: windowHeight * 0.4,
  }
  if (right) {
    style['left'] = x
  } else {
    style['right'] = windowWidth - uiState.rightPanelWidth - x
  }
  if (bottom) {
    if (selectionState.lastSelected.fromMain) {
      style['top'] = y
    } else {
      style['top'] = y + (windowHeight - subHeight - FOOTER_HEIGHT)
    }
  } else {
    if (selectionState.lastSelected.fromMain) {
      style['bottom'] = windowHeight - y - FOOTER_HEIGHT
    } else {
      style['bottom'] = subHeight - y
    }
  }

  return (
    <div className={classes.root} style={style}>
      <PropertyPanel attrMap={nonEmptyMap} onClose={onClose} isNode={isNode} />
    </div>
  )
}

function getWindowDimensions() {
  const { innerWidth: windowWidth, innerHeight: windowHeight } = window
  return {
    windowWidth,
    windowHeight,
  }
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  )

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowDimensions
}

export default Popup
