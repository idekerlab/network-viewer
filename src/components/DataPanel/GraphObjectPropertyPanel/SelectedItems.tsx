import React, { useContext, useEffect } from 'react'
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles'

import ListSubheader from '@material-ui/core/ListSubheader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import DataTable from '../../DataTable'

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
  const { selectedObjects, label, avatarLetter, nodeAttributes } = props

  const [open, setOpen] = React.useState(true)

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
          {selectedObjects.map((n) => {
            const attr = nodeAttributes[n]

            let keys = []
            let name = n.toString()
            if(attr !== undefined) {
              keys = [...attr.keys()]
              name = attr.get('name')
            }


            return (
              <React.Fragment>
                <ListItem dense className={classes.nested} key={n}>
                  <ListItemText primary={name} secondary={n} />
                </ListItem>
              </React.Fragment>
            )
          })}
        </List>
      </Collapse>
    </React.Fragment>
  )
}

export default SelectedItems
