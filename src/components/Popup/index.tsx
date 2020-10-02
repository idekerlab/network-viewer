import React, { useContext, useState, useEffect, FC, useMemo } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { useParams } from 'react-router-dom'
import AppContext from '../../context/AppState'
import useAttributes from '../../hooks/useAttributes'
import PropertyPanel from '../PropertyPanel'
import UIState from '../../model/UIState'
import { UIStateActions } from '../../reducer/uiStateReducer'
import { getContextFromCx, processList, processItem } from '../../utils/contextUtil'

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
      zIndex: 1500,
      padding: '1em',
      paddingTop: 0,
      overflowY: 'auto',
    },
  }),
)

const PopupTarget = {
  MAIN: 'main',
  SUB: 'sub',
  LAST: 'last',
}

const ObjectType = {
  NODE: 'node',
  EDGE: 'edge',
}

type PopupProps = {
  cx: object[]
  target?: string
  objectType?: string
}

const Popup: FC<PopupProps> = ({ cx, objectType = ObjectType.NODE }: PopupProps) => {
  const classes = useStyles()
  const { uuid } = useParams()
  const attr = useAttributes(uuid, cx)
  const { uiState, uiStateDispatch, selection } = useContext(AppContext)
  const { windowHeight, windowWidth } = useWindowDimensions()
  const FOOTER_HEIGHT = 60

  const context = useMemo(() => getContextFromCx(cx), [cx])

  let objects = selection.lastSelected.nodes
  if (objectType === ObjectType.EDGE) {
    objects = selection.lastSelected.edges
  }

  const { showPropPanel, pointerPosition } = uiState

  const setShowPropPanelFalse = (state: UIState) =>
    uiStateDispatch({ type: UIStateActions.SET_SHOW_PROP_PANEL_FALSE, uiState: state })

  const onClose = () => {
    setShowPropPanelFalse({ ...uiState })
  }

  if (!showPropPanel || objects.length === 0) {
    return <div />
  }

  const id = objects[0]
  let attrMap = null
  if (objectType === ObjectType.NODE) {
    attrMap = attr.nodeAttr[id]
  } else {
    attrMap = attr.edgeAttr[id]
  }

  //Process attrMap to only display non-empty fields
  //and properly display links and lists
  const nonEmptyMap = new Map()
  for (let item of attrMap) {
    let include = false
    if (Array.isArray(item[1])) {
      for (let arrayItem of item[1]) {
        if (arrayItem !== undefined && arrayItem !== '') {
          include = true
          break
        }
      }
    } else {
      if (item[1] !== undefined && item[1] !== '') {
        include = true
      }
    }
    if (include) {
      let value
      if (Array.isArray(item[1])) {
        value = processList(item[1], context)
      } else {
        value = processItem(item[1], context, true)
      }
      nonEmptyMap.set(item[0], value)
    }
  }
  attrMap = nonEmptyMap

  //Calculate position based on pointer position in window
  const effectiveWindowHeight = windowHeight - FOOTER_HEIGHT

  //Left or right?
  const width = effectiveWindowHeight * 0.5
  let right = true
  if (pointerPosition.x + width > uiState.leftPanelWidth) {
    if (pointerPosition.x - width > 0) {
      right = false
    }
  }

  //Top or bottom
  const maxHeight = effectiveWindowHeight * 0.4
  let height = 88 //Title height + body padding
  for (let i = 1; i < attrMap.size; i++) {
    height += 40 //List item height
    if (height >= maxHeight) {
      height = maxHeight
      break
    }
  }

  let bottom = true
  if (selection.lastSelected.from === 'main') {
    if (pointerPosition.y + height > effectiveWindowHeight) {
      if (pointerPosition.y - height > 0) {
        bottom = false
      }
    }
  } else {
    if (pointerPosition.y + height > effectiveWindowHeight * 0.7) {
      if (pointerPosition.y - height > effectiveWindowHeight * -0.3) {
        bottom = false
      }
    }
  }

  const style = {
    maxHeight: maxHeight,
  }
  if (right) {
    style['left'] = pointerPosition.x
  } else {
    style['right'] = uiState.leftPanelWidth - pointerPosition.x
  }
  if (bottom) {
    if (selection.lastSelected.from === 'main') {
      style['top'] = pointerPosition.y
    } else {
      style['top'] = pointerPosition.y + effectiveWindowHeight * 0.3
    }
  } else {
    if (selection.lastSelected.from === 'main') {
      style['bottom'] = effectiveWindowHeight - pointerPosition.y
    } else {
      style['bottom'] = effectiveWindowHeight * 0.7 - pointerPosition.y
    }
  }

  return (
    <div className={classes.root} style={style}>
      <PropertyPanel attrMap={attrMap} onClose={onClose} />
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
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

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
