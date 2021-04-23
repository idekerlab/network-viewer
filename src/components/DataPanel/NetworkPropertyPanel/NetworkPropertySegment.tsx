import React from 'react'
import { Typography, makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(1),
  },
  segmentTitle: {
    marginTop: theme.spacing(1),
  },
}))

const NetworkPropertySegment = (props) => {
  const { summary, details } = props
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {summary ? (
        <Typography
          variant="caption"
          color="textSecondary"
          display="block"
          className={classes.segmentTitle}
        >
          {summary}
        </Typography>
      ) : null}
      <Typography variant="body2" display="block" component="div">
        {details}
      </Typography>
    </div>
  )
}

export default NetworkPropertySegment
