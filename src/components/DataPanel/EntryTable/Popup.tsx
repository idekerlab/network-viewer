import React, { VFC } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Linkify from 'linkify-react'
import CloseIcon from '@material-ui/icons/Close'

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
  titleBar: {
    display: 'flex',
    height: '2em',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: '0.5em',

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

  const getLinks = (value) => {
    return value.map((v, i) => (
      <Linkify properties={{ target: '_blank' }}>{v}</Linkify>
    ))
  }
  return (
    <Card
      className={classes.root}
      style={{ left: x, top: y }}
      variant="outlined"
    >
      <CardContent className={classes.content}>
        <div className={classes.titleBar}>
          <CloseIcon onClick={_handleClick} />
          <Typography
            className={classes.title}
            color="textSecondary"
            
          >
            Cell Contents
          </Typography>
        </div>
        {Array.isArray(value) ? (
          getLinks(value)
        ) : (
          <Typography variant="body2">{value}</Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default Popup
