import React, { FC } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import WarningIcon from '@material-ui/icons/Warning'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'grid',
      width: '100%',
      height: '100%',
      placeItems: 'center',
      background: '#FAFAFA',
    },
    item: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2em',
    },
    message: {
      padding: '0.5em',
      color: '#999999',
      textAlign: 'center',
    },
    title: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1em',
    },
  }),
)

type EmptyViewProps = {
  title: string
  message?: string
}

const EmptyView: FC<EmptyViewProps> = ({ title = '-', message = '-' }: EmptyViewProps) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <div className={classes.item}>
        <div className={classes.title}>
          <WarningIcon fontSize='large' color="error" />
          <Typography className={classes.message} variant="h3">
            {title}
          </Typography>
        </div>
        <Typography className={classes.message} variant="subtitle1">
          {message}
        </Typography>
      </div>
    </div>
  )
}

export default EmptyView
