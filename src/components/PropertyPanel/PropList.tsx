import React from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: 'inherit',
    },
  }),
)

const PropList = ({ attrMap }) => {
  const classes = useStyles()
  const keys = [...attrMap.keys()]

  return (
    <List className={classes.root}>
      {keys.map((key) => {
        return (
          <ListItem key={key}>
            <ListItemText primary={attrMap.get(key)} secondary={key} />
          </ListItem>
        )
      })}
    </List>
  )
}

export default PropList
