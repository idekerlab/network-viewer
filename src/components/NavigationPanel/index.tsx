import React, { useContext } from 'react'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import IconButton from '@material-ui/core/IconButton'

import FitIcon from '@material-ui/icons/ZoomOutMap'
import ZoomInIcon from '@material-ui/icons/ZoomIn'
import ZoomOutIcon from '@material-ui/icons/ZoomOut'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import AppContext from '../../context/AppState'

import ExpandButton from './ExpandButton'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      zIndex: 300,
      borderRadius: 5,
      border: '1px solid #DDDDDD',
      backgroundColor: '#FFFFFF',
      position: 'absolute',
      right: '1em',
      bottom: '1em',
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
  const { cyReference, lgrReference } = useContext(AppContext)

  let cy = cyReference.main
  if (target === 'sub') {
    cy = cyReference.sub
  }

  const handleFit = (evt) => {
    if (cy !== null && cy !== undefined) {
      cy.fit()
    } else if (lgrReference !== undefined && lgrReference !== null) {
      // @ts-ignore
      lgrReference.fit()
    }
  }
  const handleZoomIn = (evt) => {
    if (cy !== null && cy !== undefined) {
      const currentZoom = cy.zoom()
      const newLevel = currentZoom * 1.2
      cy.zoom(newLevel)
    } else if (lgrReference !== undefined && lgrReference !== null) {
      // @ts-ignore
      lgrReference.zoomIn()
    }
  }
  const handleZoomOut = (evt) => {
    if (cy !== null && cy !== undefined) {
      const currentZoom = cy.zoom()
      const newLevel = currentZoom * 0.8
      cy.zoom(newLevel)
    } else if (lgrReference !== undefined && lgrReference !== null) {
      // @ts-ignore
      lgrReference.zoomOut()
    }
  }

  return (
    <ButtonGroup
      className={classes.root}
      orientation="vertical"
      color="secondary"
      variant="outlined"
      // disableFocusRipple={true}
      // disableRipple={true}
    >
      {target === 'main' ? <ExpandButton /> : <div />}
      <IconButton
        key={'fitButton'}
        color={'secondary'}
        style={{ backgroundColor: 'transparent' }}
        onClick={handleFit}
      >
        <FitIcon />
      </IconButton>
      {cy === null || cy === undefined ? (
        <div />
      ) : (
        [
          <IconButton
            key={'zoomInButton'}
            color={'secondary'}
            style={{ backgroundColor: 'transparent' }}
            onClick={handleZoomIn}
          >
            <ZoomInIcon />
          </IconButton>,
          <IconButton
            key={'zoomOutButton'}
            color={'secondary'}
            style={{ backgroundColor: 'transparent' }}
            onClick={handleZoomOut}
          >
            <ZoomOutIcon />
          </IconButton>,
        ]
      )}
    </ButtonGroup>
  )
}

export default NavigationPanel
