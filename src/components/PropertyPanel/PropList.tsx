import React from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import Linkify from 'linkifyjs/react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: 'inherit',
    },
    text: {
      display: 'inline-block',
      paddingTop: 0,
      paddingBottom: '6px',
    },
    smallText: {
      lineHeight: '16px',
    },
    bigText: {
      lineHeight: '18px',
    },
  }),
)

const PropList = ({ attrMap }) => {
  const classes = useStyles()

  attrMap.delete('name')
  const keys = [...attrMap.keys()]

  return (
    <List className={classes.root}>
      {keys.map((key) => {
        return (
          <ListItem key={key} className={classes.text} disableGutters>
            <Typography
              color="textSecondary"
              variant="caption"
              variantMapping={{ caption: 'div' }}
              className={classes.smallText}
            >
              {key}
            </Typography>
            <Typography variant="body2" component="div" className={classes.bigText}>
              <Linkify target="_blank">{attrMap.get(key)}</Linkify>
            </Typography>
          </ListItem>
        )
      })}
    </List>
  )
}

export default PropList
