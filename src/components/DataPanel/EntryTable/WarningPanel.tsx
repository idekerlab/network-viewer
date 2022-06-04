import { makeStyles, Theme, Typography } from '@material-ui/core'
import React, { VFC } from 'react'
import OpenInCytoscape from '../../FooterPanel/OpenInCytoscape'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'grid',
    justifyContent: 'center',
    alignContent: 'center',
  },
  openButton: {
    marginTop: theme.spacing(4),
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
}))

const WarningPanel: VFC<{ type: string; selectedCount: number }> = ({
  type,
  selectedCount,
}) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography
        variant={'h6'}
      >{` Too many objects (${selectedCount}) are selected.`}</Typography>
      <Typography variant={'caption'}>
        {`For large networks like this one, you can use the Cytoscape Desktop to explore/edit`}
      </Typography>

      <div className={classes.openButton}>
        <OpenInCytoscape />
      </div>
    </div>
  )
}

export default WarningPanel
