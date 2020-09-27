import React from 'react'

import { makeStyles } from '@material-ui/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'

import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import Linkify from 'linkifyjs/react'
import parse from 'html-react-parser'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '0.2em',
    backgroundColor: '#FFFFFF',
    overflow: 'auto',
    height: '100%',
    boxSizing: 'content-box',
  },
  padding: {
    paddingLeft: '1em',
    paddingTop: '0.75em',
  },
  lessPadding: {
    paddingTop: '2.49px',
  },
  noPadding: {
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0,
    lineHeight: 1.5,
    wordWrap: 'break-word',
  },
  evenLessPadding: {
    marginBottom: '-2px',
    marginTop: '4px',
  },
  descriptionContainer: {
    paddingTop: '0.5em',
    paddingBottom: '0.75em',
  },
}))

const NetworkProperties = (props) => {
  const { data, description } = props
  const classes = useStyles()

  let index = 0

  const propertiesList = [['Description', formatContent(description)]]
  let hasContext = false
  let context = ''
  for (let datum of data) {
    const value = datum.value.trim()
    const predicate = datum.predicateString.trim()
    if (value !== '') {
      if (predicate === '@context') {
        hasContext = true
        context = value
      } else {
        propertiesList.push([predicate, formatContent(value)])
      }
    }
  }
  if (hasContext) {
    propertiesList.push(['@context', formatContext(context)])
  }

  const display = []
  for (let property of propertiesList) {
    display.push(
      <ListItem key={index++} className={classes.noPadding}>
        <ListItemText
          className={classes.noPadding}
          primary={
            <>
              <Typography variant="caption" color="textSecondary" className={classes.evenLessPadding} component="div">
                {property[0]}
              </Typography>
              <div>
                <Typography variant="body2">{property[1]}</Typography>
              </div>
            </>
          }
        />
      </ListItem>,
    )
  }

  return (
    <div className={classes.descriptionContainer}>
      <List className={classes.noPadding}>{display}</List>
    </div>
  )
}

const formatContent = (string) => {
  if (string == undefined) {
    return
  }
  string = string.toString().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\ *>/gi, '')
  string = parse(string)
  return <Linkify key={Math.random().toString()}>{string}</Linkify>
}

const formatContext = (string) => {
  const returnArray = []
  const context = JSON.parse(string)
  for (const key in context) {
    returnArray.push(
      <tr key={Math.random().toString()}>
        <td valign="top">
          <Typography variant="body2">{key}</Typography>
        </td>
        <td valign="top" style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
          <Typography variant="body2">{context[key]}</Typography>
        </td>
      </tr>,
    )
  }

  const details = (
    <table>
      <tbody>{returnArray}</tbody>
    </table>
  )
  const summary = (
    <Typography component="span" variant="body2">
      Click to view the namespaces associated with this network
    </Typography>
  )

  return <ExpandPanel summary={summary} details={details} defaultExpanded={false} />
}

function ExpandPanel(props) {
  const [open, setOpen] = React.useState(props.defaultExpanded)
  let style

  function handleClick() {
    setOpen(!open)
  }

  return (
    <React.Fragment>
      <ListItem button onClick={handleClick} key={Math.random()} style={{ padding: 0 }}>
        <ListItemText primary={props.summary} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem style={{ paddingTop: 0, paddingBottom: 0 }}>
            <ListItemText primary={props.details} />
          </ListItem>
        </List>
      </Collapse>
    </React.Fragment>
  )
}

export default NetworkProperties
