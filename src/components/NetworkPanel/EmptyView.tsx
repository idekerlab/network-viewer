import React, { FC } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import WarningIcon from '@material-ui/icons/Warning'

import DownArrowIcon from '@material-ui/icons/ArrowDownward'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      boxSizing: 'border-box',
      display: 'grid',
      width: '100%',
      height: '100%',
      placeItems: 'center',
      background: '#EEEEEE',
      zIndex: 0
    },
    item: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1em',
      width: '60%',
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
    },
    arrow1: {
      position: 'fixed',
      color: '#999999',
      bottom: '2vh',
      left: '1vw',
      fontSize: '7em',
    },
    warningIcon: {
      color: 'red',
      fontSize: '7em',
    },
  }),
)

type EmptyViewProps = {
  title: string
  message?: string
  showIcons?: boolean
}

const EmptyView: FC<EmptyViewProps> = ({ title = '-', message = '-', showIcons = false }: EmptyViewProps) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <div className={classes.item}>
        <WarningIcon fontSize="inherit" className={classes.warningIcon} />
        <div className={classes.title}>
          <Typography className={classes.message} variant="h3">
            {title}
          </Typography>
        </div>
        <Typography className={classes.message} variant="subtitle1">
          {message}
        </Typography>
      </div>
      {showIcons ? (
        <div className={classes.arrow1}>
          <Typography variant="h6">Query this network from here.</Typography>
          <DownArrowIcon fontSize="inherit" />
        </div>
      ) : null}
    </div>
  )
}

export default EmptyView
