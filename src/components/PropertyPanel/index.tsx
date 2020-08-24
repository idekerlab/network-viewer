import React, { FC, useContext } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import AppContext from '../../context/AppState'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'absolute',
      display: 'grid',
      width: '20vh',
      height: '20vh',
      background: '#EFEFEF',
      placeItems: 'center',
      borderRadius: 8,
      border: '1px solid #999999',
      zIndex: 500
    },
    item: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    message: {
      padding: '2em',
    },
  }),
)


const PropertyPanel: FC = () => {
  const classes = useStyles()
  const { uiState, selection } = useContext(AppContext)

  const {showPropPanel, pointerPosition} = uiState


  if(!showPropPanel) {
    return <div />
  }

  const position = {
    left: pointerPosition.x,
    top: pointerPosition.y,
  }

  return (
    <div className={classes.root} style={position}>
      <div className={classes.item}>
        <Typography className={classes.message} variant="h5">
          Selected Node: {selection.main.nodes}
        </Typography>
      </div>
    </div>
  )
}

export default PropertyPanel
