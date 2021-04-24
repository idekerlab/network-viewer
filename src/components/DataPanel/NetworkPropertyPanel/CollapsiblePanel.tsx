import React, { useState } from 'react'
import { Collapse, makeStyles, Theme, Typography } from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) => ({
  collapsiblePanelTitle: {
    padding: theme.spacing(1),
    borderBottomWidth: '1px',
    borderBottomColor: theme.palette.divider,
    borderBottomStyle: 'solid',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04) !important',
      cursor: 'pointer',
    },
    height: '2.8em',
  },
  collapsiblePanel: {},
  expandIcon: {
    float: 'right',
  },
}))

const CollapsiblePanel = (props) => {
  const classes = useStyles()
  const { openByDefault, summary, children, backgroundColor, onClick } = props
  const [open, setOpen] = useState(openByDefault)

  const handleClick = () => {
    onClick(!open)
    setOpen(!open)
  }

  return (
    <>
      <div
        onClick={handleClick}
        className={classes.collapsiblePanelTitle}
        style={{ backgroundColor: backgroundColor }}
      >
        <Typography variant="caption" color="textSecondary">
          {summary}
          {open ? (
            <ExpandLess className={classes.expandIcon} />
          ) : (
            <ExpandMore className={classes.expandIcon} />
          )}
        </Typography>
      </div>
      <div style={{ minHeight: 'auto' }}>
        <Collapse
          in={open}
          timeout="auto"
          unmountOnExit
          className={classes.collapsiblePanel}
          style={{ backgroundColor: backgroundColor, marginBottom: '-16px' }}
        >
          {children}
        </Collapse>
      </div>
    </>
  )
}

export default CollapsiblePanel
