import React, { FC } from 'react'
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
      zIndex: 400,
      background: '#FAFAFA',
    },
    item: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    message: {
      padding: '2em',
      color: '#999999',
    },
  }),
)

type LoadingProps = {
  message: string
  showLoading?: boolean
}

const Loading: FC<LoadingProps> = ({ message, showLoading = true }: LoadingProps) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <div className={classes.item}>
        <Typography className={classes.message} variant="h5">
          {message}
        </Typography>
        {showLoading ? <CircularProgress disableShrink size={'10em'} color="secondary" /> : null}
      </div>
    </div>
  )
}

export default Loading
