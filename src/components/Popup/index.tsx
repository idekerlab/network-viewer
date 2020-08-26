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

const Popup = ({ cx }) => {
  const classes = useStyles()
  const { uuid } = useParams()
  const attr = useAttributes(uuid, cx)
  const { uiState, setUIState, selection } = useContext(AppContext)

  const { showPropPanel, pointerPosition } = uiState

  const onClose = () => {
    setUIState({ ...uiState, showPropPanel: false })
    console.log('CLOSE!!')
  }

  if (!showPropPanel || selection.main.nodes.length === 0) {
    return <div />
  }

  const position = {
    left: pointerPosition.x,
    top: pointerPosition.y,
  }

  const nodes = selection.main.nodes
  const nodeId = selection.main.nodes[0]
  const attrMap = attr.nodeAttr[nodeId]

  console.log(nodes, nodeId, attrMap)
  return (
    <div className={classes.root} style={position}>
      <PropertyPanel attrMap={attrMap} onClose={onClose} />
    </div>
  )
}

export default Popup
