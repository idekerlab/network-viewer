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
      position: 'fixed',
      zIndex: 3000,
      left: '1em',
      marginTop: '5em',
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

const NavigationPanel = ({ target = 'main' }) => {
  const classes = useStyles()

  const appContext = useContext(AppContext)
  const { cyReference } = appContext

  let cy = cyReference.main
  if (target === 'sub') {
    cy = cyReference.sub
  }

  const handleFit = (evt) => {
    cy.fit()
  }
  const handleZoomIn = (evt) => {
    const currentZoom = cy.zoom()
    const newLevel = currentZoom * 1.2
    cy.zoom(newLevel)
  }
  const handleZoomOut = (evt) => {
    const currentZoom = cy.zoom()
    const newLevel = currentZoom * 0.8
    cy.zoom(newLevel)
  }

  return (
      <ButtonGroup
        className={classes.root}
        orientation="vertical"
        color="secondary"
        variant="outlined"
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
