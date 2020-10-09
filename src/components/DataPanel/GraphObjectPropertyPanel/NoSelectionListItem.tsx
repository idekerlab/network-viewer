import React, { FC } from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'

export type NoSelectionProps = {
  avatarLetter: string
  objType: string
  avatarColor: string
}

const NoSelectionListItem: FC<NoSelectionProps> = (props: NoSelectionProps) => (
  <List>
    <ListItem dense>
      <ListItemAvatar>
        <Avatar alt={props.objType}>{props.avatarLetter}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={props.objType} />
    </ListItem>
  </List>
)

export default NoSelectionListItem
