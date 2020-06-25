import React from 'react'

import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dataPanel: {
      width: '100%',
      height: '100%',
      backgroundColor: '#00FF00',
    },
  }),
)
const DataPanel = () => {
  const classes = useStyles()
  return <div className={classes.dataPanel}>This is a test</div>
}

export default DataPanel
