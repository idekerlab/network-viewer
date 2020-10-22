import React from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import MinimizeButton from './NetworkPropertyPanel/MinimizeButton'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'fixed',
      right: 0,
      top: 0,
      paddingTop: '1vh',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 300,
    },
  }),
)
const ClosedPanel = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <MinimizeButton />
    </div>
  )
}

export default ClosedPanel
