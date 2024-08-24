import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Typography, IconButton } from '@material-ui/core'
import PropList from './PropList'
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      display: 'flex',
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    name: {
      fontWeight: 500,
      fontSize: '1.5em',
      flexGrow: 3,
      paddingTop: '12.5px',
      paddingBottom: '12.5px',
    },
    propList: {
      height: '100%',
      width: '100%',
      padding: 0,
      margin: 0,
      borderTop: '1px solid #777777',
      overflowX: 'auto',
    },
  }),
)

const PropertyPanel = ({ attrMap, onClose, isNode }) => {
  const classes = useStyles()

  const handleClose = () => {
    onClose()
  }
  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <Typography className={classes.name} variant="body1">
          {attrMap.get('name') ?? ''}
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <div className={classes.propList}>
        <div>
          <PropList attrMap={attrMap} />
        </div>
      </div>
    </div>
  )
}

export default PropertyPanel
