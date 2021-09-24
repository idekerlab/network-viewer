import React, { FC, ReactNode, useState, useEffect } from 'react'
import { Collapse, makeStyles, Theme, Typography } from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) => ({
  collapsiblePanelTitle: {
    padding: theme.spacing(1),
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
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
  className?: string,
  open: boolean,
  setOpen: (boolean) => void
}

const CollapsiblePanel: FC<CollapsiblePanelProps> = ({
  openByDefault = true,
  title = '?',
  children,
  backgroundColor,
  open,
  setOpen

}) => {

  const classes = useStyles()

  useEffect(() => {
    console.log(open)
  }, [])

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
        <Typography variant="subtitle2" color="textSecondary">
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
