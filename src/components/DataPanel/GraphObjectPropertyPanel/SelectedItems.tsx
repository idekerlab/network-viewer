import React, { useState } from 'react'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import EntryTable from './EntryTable'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    nested: {
      paddingLeft: theme.spacing(4),
    },
    nodes: {
      backgroundColor: theme.palette.secondary.main,
    },
    edges: {
      backgroundColor: theme.palette.secondary.main,
    },
  }),
)

const SelectedItems = (props) => {
  const classes = useStyles()
  const { selectedObjects, label, avatarLetter, attributes } = props

  const [open, setOpen] = useState(true)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <React.Fragment>
      <ListItem dense button onClick={handleClick}>
        <ListItemAvatar>
          <Avatar className={classes.nodes} alt={label}>
            {avatarLetter}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={label} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {selectedObjects.map((n: string) => {
            const attr = attributes[n]
            return <EntryTable key={'attr-table-' + n} title={attr.get('name')} attributes={attr} />
          })}
        </List>
      </Collapse>
    </React.Fragment>
  )
}

export default SelectedItems
