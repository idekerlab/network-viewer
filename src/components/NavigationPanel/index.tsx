import React, { useContext, useState } from 'react'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'

import FitIcon from '@material-ui/icons/ZoomOutMap'
import ZoomInIcon from '@material-ui/icons/ZoomIn'
import ZoomOutIcon from '@material-ui/icons/ZoomOut'

import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import AppContext from '../../context/AppState'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // backgroundColor: 'rgba(240, 240, 240, 0.5',
      marginLeft: '1em',
      zIndex: 999,
      position: 'absolute',
      top: '5em',
      left: 0,
      borderRadius: 10,

      border: '1px solid #AAAAAA',
    },
    subnet: {
      width: '100%',
      height: '100%',
      backgroundColor: '#AAAAAA',
    },
  }),
)

const NavigationPanel = () => {
  const classes = useStyles()
  const [zoomLevel, setZoomLevel] = useState(1.0)

  const appContext = useContext(AppContext)
  const { cy } = appContext

  const handleFit = (evt) => {
    if (cy) {
      cy.fit()
      console.log('* Fit content')
    }
  }
  const handleZoomIn = (evt) => {
    if (cy) {
      console.log('* Zoom in')
      const newLevel = zoomLevel * 1.2
      cy.zoom(newLevel)
      setZoomLevel(newLevel)
    }
  }
  const handleZoomOut = (evt) => {
    if (cy) {
      console.log('* Zoom out')
      const newLevel = zoomLevel * 0.8
      cy.zoom(newLevel)
      setZoomLevel(newLevel)
    }
  }


  return (
    <ButtonGroup
      className={classes.root}
      orientation="vertical"
      color="secondary"
      variant="outlined"
      aria-label="vertical outlined secondary button group"
    >
      <IconButton onClick={handleFit}>
        <FitIcon />
      </IconButton>
      <IconButton onClick={handleZoomIn}>
        <ZoomInIcon />
      </IconButton>
      <IconButton onClick={handleZoomOut}>
        <ZoomOutIcon />
      </IconButton>
    </ButtonGroup>
  )
}

export default NavigationPanel
