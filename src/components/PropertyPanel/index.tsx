import React, { FC, useContext } from 'react'
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
      height: '4em',
      borderBottom: '1px solid #777777',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    name: {
      fontWeight: 500,
      fontSize: '1.5em',
      flexGrow: 3,
    },

    propList: {
      height: '30vh',
      width: '100%',
      overflowY: 'auto',
      padding: 0,
      margin: 0,
    },
  }),
)

const PropertyPanel = ({ attrMap, onClose }) => {
  const classes = useStyles()

  const handleClose = () => {
    onClose()
  }

  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <Typography className={classes.name} variant="body1">
          {attrMap.get('name')}
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <div className={classes.propList}>
        <PropList attrMap={attrMap} />
      </div>
    </div>
  )
}

export default PropertyPanel
