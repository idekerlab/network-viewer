import React from 'react'

import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import SearchIcon from '@material-ui/icons/Search'

import Linkify from 'linkifyjs/react'
import parse from 'html-react-parser'

import CollapsiblePanel from './CollapsiblePanel'
import NetworkPropertySegment from './NetworkPropertySegment'

const useStyles = makeStyles((theme) => ({
  table: {
    cellSpacing: 0,
    borderSpacing: 0,
    borderCollapse: 'collapse',
  },
  tdTitle: {
    whiteSpace: 'nowrap',
    paddingRight: '1em',
    paddingLeft: 0,
    verticalAlign: 'top',
  },
  tdContent: {
    wordWrap: 'break-word',
    wordBreak: 'break-all',
    verticalAlign: 'top',
  },

  icon: {
    verticalAlign: 'middle',
    height: '0.9em',
    marginLeft: theme.spacing(1),
  },
}))

const NetworkProperties = (props) => {
  const { summary } = props
  const properties = summary.properties
  const description = summary.description
  const classes = useStyles()

  let informationDisplay
  let descriptionDisplay
  let propertiesDisplay
  let contextDisplay

  //Information display
  const informationTableContents = []
  if (summary.owner) {
    informationTableContents.push(
      <tr key="owner">
        <td className={classes.tdTitle}>Owner</td>
        <td className={classes.tdContent}>{summary.owner}</td>
      </tr>,
    )
  }
  if (summary.creationTime) {
    const creationDate = new Date(summary.creationTime)
    informationTableContents.push(
      <tr key="created">
        <td className={classes.tdTitle}>Created</td>
        <td className={classes.tdContent}>
          {creationDate.toLocaleDateString() + ' ' + creationDate.toLocaleTimeString()}
        </td>
      </tr>,
    )
  }
  if (summary.modificationTime) {
    const modificationDate = new Date(summary.modificationTime)
    informationTableContents.push(
      <tr key="lastModified">
        <td className={classes.tdTitle}>Last modified</td>
        <td className={classes.tdContent}>
          {modificationDate.toLocaleDateString() + ' ' + modificationDate.toLocaleTimeString()}
        </td>
      </tr>,
    )
  }
  if (summary.externalId) {
    informationTableContents.push(
      <tr key="uuid">
        <td className={classes.tdTitle}>UUID</td>
        <td className={classes.tdContent}>{summary.externalId}</td>
      </tr>,
    )
  }
  if (summary.visibility) {
    if (summary.indexLevel && (summary.indexLevel === 'ALL' || summary.indexLevel === 'META')) {
      informationTableContents.push(
        <tr key="visibility">
          <td className={classes.tdTitle}>Visibility</td>
          <td className={classes.tdContent} valign="center">
            {summary.visibility}

            <SearchIcon className={classes.icon} />
          </td>
        </tr>,
      )
    } else {
      informationTableContents.push(
        <tr key="visibility">
          <td className={classes.tdTitle}>Visibility</td>
          <td className={classes.tdContent}>{summary.visibility}</td>
        </tr>,
      )
    }
  }
  if (informationTableContents.length > 0) {
    const informationList = [
      [
        null,
        <table className={classes.table}>
          <tbody>{informationTableContents}</tbody>
        </table>,
      ],
    ]
    informationDisplay = formatDisplay(informationList)
  }

  //Properties display
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
          <tr key={predicate}>
            <td className={classes.tdTitle}>{formatTitle(predicate)}</td>
            <td className={classes.tdContent}>{formatContent(value)}</td>
          </tr>,
        )
      }
    }
  }
  if (propertiesTableContent.length > 0) {
    propertiesDisplay = formatDisplay([
      [
        null,
        <table className={classes.table}>
          <tbody>{propertiesTableContent}</tbody>
        </table>,
      ],
    ])
  }

  //Description display
  const descriptionList = []
  if (description !== undefined && description.length > 0) {
    descriptionList.push([null, formatContent(description)])
  }
  if (rights || rightsHolder) {
    const rightsTable = (
      <table className={classes.table}>
        <tbody>
          {rights ? (
            <tr>
              <td className={classes.tdTitle}>Rights</td>
              <td className={classes.tdContent}>{formatContent(rights)}</td>
            </tr>
          ) : null}
          {rightsHolder ? (
            <tr>
              <td className={classes.tdTitle}>Rights holder</td>
              <td className={classes.tdContent}>{formatContent(rightsHolder)}</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    )
    descriptionList.push(['Rights', rightsTable])
  }
  if (reference) {
    descriptionList.push(['Reference', formatContent(reference)])
  }
  if (descriptionList.length > 0) {
    descriptionDisplay = formatDisplay(descriptionList)
  }

  //Context display
  if (context) {
    const parsedContext = JSON.parse(context)
    const contextList = []
    let index = 0
    for (const key in parsedContext) {
      contextList.push(
        <tr key={index++}>
          <td className={classes.tdTitle}>
            <Typography variant="body2">{key}</Typography>
          </td>
          <td className={classes.tdContent}>
            <Typography variant="body2">{parsedContext[key]}</Typography>
          </td>
        </tr>,
      )
    }
    contextDisplay = (
      <table>
        <tbody>{contextList}</tbody>
      </table>
    )
  }

  let darkBackground = 0
  return (
    <>
      {informationDisplay ? (
        <CollapsiblePanel
          openByDefault={false}
          summary="Network information"
          children={informationDisplay}
          backgroundColor={darkBackground++ % 2 === 0 ? 'inherit' : 'white'}
        />
      ) : null}
      {descriptionDisplay ? (
        <CollapsiblePanel
          openByDefault={true}
          summary="Description"
          children={descriptionDisplay}
          backgroundColor={darkBackground++ % 2 === 0 ? 'inherit' : 'white'}
        />
      ) : null}
      {propertiesDisplay ? (
        <CollapsiblePanel
          openByDefault={false}
          summary="Properties"
          children={propertiesDisplay}
          backgroundColor={darkBackground++ % 2 === 0 ? 'inherit' : 'white'}
        />
      ) : null}
      {contextDisplay ? (
        <CollapsiblePanel
          openByDefault={false}
          summary="@context: View namespaces"
          children={contextDisplay}
          backgroundColor={darkBackground++ % 2 === 0 ? 'inherit' : 'white'}
        />
      ) : null}
    </>
  )
}

const formatTitle = (string) => {
  if (string == undefined) {
    return
  }
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const formatContent = (string) => {
  if (string == undefined) {
    return
  }
  string = string.toString().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\ *>/gi, '')
  string = parse(string)
  return <Linkify target="_blank">{string}</Linkify>
}

const formatDisplay = (propertiesList) => {
  const display = []
  let index = 0
  for (let property of propertiesList) {
    display.push(<NetworkPropertySegment summary={property[0]} details={property[1]} key={index++} />)
  }
  return display
}

export default NetworkProperties
