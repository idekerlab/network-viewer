import React, { FC, ReactNode, useState } from 'react'
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
  collapsiblePanel: {
    paddingBottom: theme.spacing(2)
  },
  expandIcon: {
    float: 'right',
  },
}))

type CollapsiblePanelProps = {
  openByDefault?: boolean
  title: string
  children: ReactNode
  backgroundColor?: string,
  className?: string
}

const CollapsiblePanel: FC<CollapsiblePanelProps> = ({
  openByDefault = true,
  title = '?',
  children,
  backgroundColor,

}) => {

  const classes = useStyles()
  const [open, setOpen] = useState(openByDefault)

  const _handleClick = () => {
    setOpen(!open)
  }

  return (
    <>
      <div
        onClick={_handleClick}
        className={classes.collapsiblePanelTitle}
        style={{ backgroundColor }}
      >
        <Typography variant="caption" color="textSecondary">
          {title}
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
          style={{ backgroundColor, marginBottom: '-16px' }}
        >
          {children}
        </Collapse>
      </div>
    </>
  )
}

export default CollapsiblePanel
