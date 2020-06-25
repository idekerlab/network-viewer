import React from 'react'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      backgroundColor: '#FF0000',
    },
  }),
)
const NetworkPanel = () => {
  const classes = useStyles()

  return <div className={classes.root}>This is for network</div>
}

export default NetworkPanel
