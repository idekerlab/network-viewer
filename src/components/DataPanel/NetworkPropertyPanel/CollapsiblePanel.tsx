import React, { useState } from 'react'
import { Collapse, makeStyles, Theme, Typography } from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) => ({
  collapsiblePanelTitle: {
    padding: theme.spacing(1),
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04) !important',
      cursor: 'pointer',
    },
  },
  collapsiblePanel: {
    padding: theme.spacing(1),
    paddingTop: 0,
  },
  expandIcon: {
    float: 'right',
  },
}))

const CollapsiblePanel = (props) => {
  const classes = useStyles()
  const { openByDefault, summary, children, backgroundColor } = props
  const [open, setOpen] = useState(openByDefault)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <>
      <div onClick={handleClick} className={classes.collapsiblePanelTitle} style={{ backgroundColor: backgroundColor }}>
        <Typography variant="caption" color="textSecondary">
          {summary}
          {open ? <ExpandLess className={classes.expandIcon} /> : <ExpandMore className={classes.expandIcon} />}
        </Typography>
      </div>
      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        className={classes.collapsiblePanel}
        style={{ backgroundColor: backgroundColor }}
      >
        {children}
      </Collapse>
    </>
  )
}

export default CollapsiblePanel
