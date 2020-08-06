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
      backgroundColor: 'rgba(0,0,0,0)',
      display: 'flex',
      flexDirection: 'column'
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
