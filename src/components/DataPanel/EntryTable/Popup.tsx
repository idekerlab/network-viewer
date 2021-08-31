import React, { VFC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles({
  root: {
    minWidth: '15em',
    width: '20em',
    height: '20em',
    zIndex: 1000,
    position: 'fixed',
    border: '1px solid #666666',
    cursor: 'pointer',
  },
  content: {
    margin: 0,
    padding: '0.3em',
    overflowY: 'scroll',
    width: '100%',
    height: '100%',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
})

const Popup: VFC<{
  x: number
  y: number
  open: boolean
  setOpen: (boolean) => void
  key?: string
  value: string
}> = ({ x, y, open, setOpen, key, value }) => {
  const classes = useStyles()

  const _handleClick = (evt): void => {
    evt.preventDefault()
    setOpen(false)
  }

  if (open === false) {
    return null
  }

  return (
    <Card
      className={classes.root}
      style={{ left: x, top: y }}
      variant="outlined"
      onClick={_handleClick}
    >
      <CardContent className={classes.content}>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Cell contents (click to close)
        </Typography>
        <Typography variant="body2" component="p">
          {value}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default Popup
