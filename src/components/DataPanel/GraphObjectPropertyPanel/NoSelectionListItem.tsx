import React, { FC, useContext } from 'react'
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles'

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
  <ListItem dense>
    <ListItemAvatar>
      <Avatar alt={props.objType}>{props.avatarLetter}</Avatar>
    </ListItemAvatar>
    <ListItemText primary={props.objType} />
  </ListItem>
)

export default NoSelectionListItem
