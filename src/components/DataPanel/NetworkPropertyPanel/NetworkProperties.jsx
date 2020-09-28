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
    backgroundColor: '#FFFFFF',
    overflow: 'auto',
    height: '100%',
    boxSizing: 'content-box',
  },
  noPadding: {
    wordWrap: 'break-word',
  },
  tdTitle: {
    whiteSpace: 'nowrap',
    paddingRight: '1em',
    paddingLeft: 0,
  },
  whiteBackground: {
    backgroundColor: 'white',
  },
  sectionContainer: {
    paddingTop: '8px',
  },
  table: {
    cellSpacing: 0,
    borderSpacing: 0,
    borderCollapse: 'collapse',
  },
  listItem: {
    paddingTop: 0,
  },
}))

let index = 0

const NetworkProperties = (props) => {
  const { summary } = props
  const properties = summary.properties
  const description = summary.description
  const classes = useStyles()

  const formatDisplay = (propertiesList) => {
    const display = []
    for (let property of propertiesList) {
      display.push(
        <ListItem key={index++} className={classes.listItem}>
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
    return display
  }

  const returnList = []

  //Top panel
  const informationTableContents = []
  if (summary.owner) {
    informationTableContents.push(
      <tr>
        <td className={classes.tdTitle}>Owner</td>
        <td>{summary.owner}</td>
      </tr>,
    )
  }
  if (summary.creationTime) {
    const creationDate = new Date(summary.creationTime)
    informationTableContents.push(
      <tr>
        <td className={classes.tdTitle}>Created</td>
        <td>{creationDate.toLocaleDateString() + ' ' + creationDate.toLocaleTimeString()}</td>
      </tr>,
    )
  }
  if (summary.modificationTime) {
    const modificationDate = new Date(summary.modificationTime)
    informationTableContents.push(
      <tr>
        <td className={classes.tdTitle}>Last modified</td>
        <td>{modificationDate.toLocaleDateString() + ' ' + modificationDate.toLocaleTimeString()}</td>
      </tr>,
    )
  }
  if (summary.externalId) {
    informationTableContents.push(
      <tr>
        <td className={classes.tdTitle}>UUID</td>
        <td>{summary.externalId}</td>
      </tr>,
    )
  }
  if (informationTableContents.length > 0) {
    const informationList = [
      ['Network information', <table className={classes.table}>{informationTableContents}</table>],
    ]
    const informationDisplay = formatDisplay(informationList)
    returnList.push(<div className={classes.sectionContainer}>{informationDisplay}</div>)
  }

  //Bottom panel
  const propertiesTableContent = []
  let context
  let rights
  let rightsHolder
  let reference
  for (let property of properties) {
    const value = property.value.trim()
    const predicate = property.predicateString.trim()
    if (value !== '' && !predicate.startsWith('__')) {
      if (predicate === '@context') {
        context = value
      } else if (predicate === 'rights') {
        rights = value
      } else if (predicate === 'rightsHolder') {
        rightsHolder = value
      } else if (predicate === 'reference') {
        reference = value
      } else {
        propertiesTableContent.push(
          <tr>
            <td className={classes.tdTitle}>{predicate}</td>
            <td>{formatContent(value)}</td>
          </tr>,
        )
      }
    }
  }

  const propertiesList = []
  if (propertiesTableContent.length > 0) {
    propertiesList.push(['Network properties', <table className={classes.table}>{propertiesTableContent}</table>])
  }
  if (context) {
    propertiesList.push(['@context', formatContext(context)])
  }

  //Middle panel
  const descriptionList = []
  if (description.length > 0) {
    descriptionList.push(['Description', description])
  }
  if (rights || rightsHolder) {
    const rightsTable = (
      <table className={classes.table}>
        {rights ? (
          <tr>
            <td className={classes.tdTitle}>Rights</td>
            <td>{rights}</td>
          </tr>
        ) : null}
        {rightsHolder ? (
          <tr>
            <td className={classes.tdTitle}>Rights holder</td>
            <td>{rightsHolder}</td>
          </tr>
        ) : null}
      </table>
    )
    descriptionList.push(['Rights', rightsTable])
  }
  if (reference) {
    descriptionList.push(['Reference', parse(reference)])
  }
  if (descriptionList.length > 0) {
    const descriptionDisplay = formatDisplay(descriptionList)
    if (returnList.length === 1) {
      returnList.splice(
        1,
        0,
        <div className={[classes.sectionContainer, classes.whiteBackground].join(' ')}>{descriptionDisplay}</div>,
      )
    } else {
      returnList.splice(1, 0, <div className={classes.sectionContainer}>{descriptionDisplay}</div>)
    }
  }

  //Bottom panel
  if (propertiesList.length > 0) {
    const propertiesDisplay = formatDisplay(propertiesList)
    if (returnList.length === 1) {
      returnList.push(
        <div className={[classes.sectionContainer, classes.whiteBackground].join(' ')}>{propertiesDisplay}</div>,
      )
    } else {
      returnList.push(<div className={classes.sectionContainer}>{propertiesDisplay}</div>)
    }
  }

  return <>{returnList}</>
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
