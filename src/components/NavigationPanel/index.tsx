import React, { useContext, useState } from 'react'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import IconButton from '@material-ui/core/IconButton'

import FitIcon from '@material-ui/icons/ZoomOutMap'
import ZoomInIcon from '@material-ui/icons/ZoomIn'
import ZoomOutIcon from '@material-ui/icons/ZoomOut'

import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import AppContext from '../../context/AppState'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '3em',
      borderRadius: 6,
      border: '1px solid #DDDDDD',
      backgroundColor: '#FFFFFF',
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
