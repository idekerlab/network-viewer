import React from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import Linkify from 'linkify-react'

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

  let represents
  if (attrMap.has('Represents')) {
    represents = attrMap.get('Represents')
    attrMap.delete('Represents')
  }

  const keys = [...attrMap.keys()].sort((a, b) => a.localeCompare(b))

  if (represents != undefined) {
    keys.unshift('Represents')
    attrMap.set('Represents', represents)
  }

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
            <Typography
              variant="body2"
              component="div"
              className={classes.bigText}
            >
              <Linkify key={key}>{attrMap.get(key)}</Linkify>
            </Typography>
          </ListItem>
        )
      })}
    </List>
  )
}

export default PropList
