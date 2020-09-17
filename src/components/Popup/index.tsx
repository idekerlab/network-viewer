import React, { FC, useContext, Children } from 'react'
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
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: '40vh',
      minWidth: '25vh',
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      border: '1px solid #999999',
      zIndex: 1500,
      padding: '1em',
      paddingTop: 0,
    },
  }),
)

const PopupTarget = {
  MAIN: 'main',
  SUB: 'sub',
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

const Popup: FC<PopupProps> = ({ cx, target = PopupTarget.MAIN, objectType = ObjectType.NODE }: PopupProps) => {
  const classes = useStyles()
  const { uuid } = useParams()
  const attr = useAttributes(uuid, cx)
  const { uiState, setUIState, selection } = useContext(AppContext)

  let selectionTarget = selection.main
  if (target === PopupTarget.SUB) {
    selectionTarget = selection.sub
  }

  let objects = selectionTarget.nodes
  if (objectType === ObjectType.EDGE) {
    objects = selectionTarget.edges
  }

  const { showPropPanel, pointerPosition } = uiState

  const onClose = () => {
    setUIState({ ...uiState, showPropPanel: false })
  }

  if (!showPropPanel || objects.length === 0) {
    return <div />
  }

  const position = {
    left: pointerPosition.x,
    top: pointerPosition.y,
  }

  const id = objects[0]
  let attrMap = null
  if (objectType === ObjectType.NODE) {
    attrMap = attr.nodeAttr[id]
  } else {
    attrMap = attr.edgeAttr[id]
  }

  return (
    <div className={classes.root} style={position}>
      <PropertyPanel attrMap={attrMap} onClose={onClose} />
    </div>
  )
}

export default Popup
