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
      zIndex: 300,
      width: '3em',
      borderRadius: 6,
      border: '1px solid #DDDDDD',
      backgroundColor: '#FFFFFF',
      position: 'absolute',
      right: '2em',
      bottom: '2em',
    },
    subnet: {
      width: '100%',
      height: '100%',
      backgroundColor: '#AAAAAA',
    },
  }),
)

// TODO: support for LGR
const NavigationPanel = ({ target = 'main' }) => {
  const classes = useStyles()
  const { cyReference, lgrReference } = useContext(AppContext)

  let cy = cyReference.main
  if (target === 'sub') {
    cy = cyReference.sub
  }

  const handleFit = (evt) => {
    if (cy !== null && cy !== undefined) {
      cy.fit()
    } else if(lgrReference !== undefined && lgrReference !== null){
      // @ts-ignore
      console.log('LGR: fit command --> ref', lgrReference.fit())
    }
  }
  const handleZoomIn = (evt) => {
    if (cy !== null && cy !== undefined) {
      const currentZoom = cy.zoom()
      const newLevel = currentZoom * 1.2
      cy.zoom(newLevel)
    } else if(lgrReference !== undefined && lgrReference !== null){
      // @ts-ignore
      lgrReference.zoomIn()
    }
  }
  const handleZoomOut = (evt) => {
    if (cy !== null && cy !== undefined) {
      const currentZoom = cy.zoom()
      const newLevel = currentZoom * 0.8
      cy.zoom(newLevel)
    } else if(lgrReference !== undefined && lgrReference !== null){
      // @ts-ignore
      lgrReference.zoomOut()
    }
  }

  return (
    <ButtonGroup className={classes.root} orientation="vertical" color="secondary" variant="outlined">
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
