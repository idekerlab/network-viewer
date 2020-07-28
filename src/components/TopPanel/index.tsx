import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'grid',
      width: '100%',
      height: '100%',
      placeItems: 'center',
    },
    item: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    message: {
      padding: '2em'
    }
  }),
)

const TopPage = (props) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.item} >
        <Typography className={classes.message} variant="h2">
          Please specify UUID of the network in the URL
        </Typography>
      </div>
    </div>
  )
}

export default TopPage
