import React, { useState } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import MinimizeButton from './NetworkPropertyPanel/MinimizeButton'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100vh',
      backgroundColor: '#FAFAFF',
      display: 'grid',
    },
  }),
)
const ClosedPanel = (props) => {
  const { uuid, cx, selection } = props
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <MinimizeButton />
    </div>
  )
}

export default ClosedPanel
