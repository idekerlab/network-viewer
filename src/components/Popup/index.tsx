import React, { useContext, useState, useEffect, FC } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { useParams } from 'react-router-dom'
import AppContext from '../../context/AppState'
import useAttributes from '../../hooks/useAttributes'
import PropertyPanel from '../PropertyPanel'

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

const Popup: FC<PopupProps> = ({ cx, target = PopupTarget.LAST, objectType = ObjectType.NODE }: PopupProps) => {
  const classes = useStyles()
  const { uuid } = useParams()
  const attr = useAttributes(uuid, cx)
  const { uiState, setUIState, selection } = useContext(AppContext)
  const { windowHeight, windowWidth } = useWindowDimensions()

  let objects = selection.lastSelected.nodes
  if (objectType === ObjectType.EDGE) {
    objects = selection.lastSelected.edges
  }

  const { showPropPanel, pointerPosition} = uiState

  const onClose = () => {
    setUIState({ ...uiState, showPropPanel: false })
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
  const nonEmptyMap = new Map()
  for (let item of attrMap) {
    let include = false
    if (Array.isArray(item[1])) {
      for (let arrayItem of item[1]) {
        if (arrayItem !== '') {
          include = true
          break
        }
      }
    } else {
      if (item[1] !== '') {
        include = true
      }
    }
    if (include) {
      nonEmptyMap.set(item[0], item[1])
    }
  }
  attrMap = nonEmptyMap

  //Calculate position based on pointer position in window

  
  //Left or right?
  const width = windowHeight * 0.4
  let right = true
  if (pointerPosition.x + width > uiState.leftPanelWidth) {
    if (pointerPosition.x - width > 0) {
      right = false
    }
  }  


  //Top or bottom
  const maxHeight = windowHeight * 0.5
  let height = 88 //Title height + body padding
  for (let i = 1; i < attrMap.size; i++) {
    height += 40 //List item height
    if (height >= maxHeight) {
      height = maxHeight
      break
    }
  }

  let bottom = true
  if (pointerPosition.y + height > windowHeight) {
    if (pointerPosition.y - height > 0) {
      bottom = false
    }
  }

  const position = {
  }
  
  if (right) {
    position['left'] = pointerPosition.x
  } else {
    position['right'] = uiState.leftPanelWidth - pointerPosition.x
  }
  if (bottom) {
    position['top'] = pointerPosition.y
  } else {
    position['bottom'] = windowHeight - pointerPosition.y
  }

  return (
    <div className={classes.root} style={position}>
      <PropertyPanel attrMap={attrMap} onClose={onClose}/>
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
