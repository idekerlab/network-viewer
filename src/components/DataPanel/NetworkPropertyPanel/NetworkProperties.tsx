import React, { FC } from 'react'
import { makeStyles } from '@material-ui/styles'
import Linkify from 'linkify-react'
import parse from 'html-react-parser'
import CollapsiblePanel from './CollapsiblePanel'
import NetworkPropertySegment from './NetworkPropertySegment'
import { NetworkPanelState } from '..'
import { Theme } from '@material-ui/core'
import { HIDDEN_ATTR_PREFIX } from '../EntryTable'

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    height: '100%',
    maxHeight: '100%',
    minHeight: '100%',
    overflowY: 'hidden',
    paddingBottom: '3.1em',
    background: 'inherit',
  },

  innerWrapper: {
    height: '100%',
    background: 'white',
    overflowY: 'auto',
    // maxHeight: '80%',
  },
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

const NetworkProperties: FC<{
  summary: any
  panelState: NetworkPanelState
  setPanelState: (state: NetworkPanelState) => void
}> = ({ summary, panelState, setPanelState }) => {
  const properties = summary.properties
  const description = summary.description
  const classes = useStyles()

  const _handleInfoOpen = (val: boolean) => {
    setPanelState({ ...panelState, netInfoOpen: val })
  }

  const _handleDescriptionOpen = (val: boolean) => {
    setPanelState({ ...panelState, descriptionOpen: val })
  }

  const _handlePropsOpen = (val: boolean) => {
    setPanelState({ ...panelState, propsOpen: val })
  }
  let informationDisplay
  let descriptionDisplay
  let propertiesDisplay

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
          {creationDate.toLocaleDateString() +
            ' ' +
            creationDate.toLocaleTimeString()}
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
          {modificationDate.toLocaleDateString() +
            ' ' +
            modificationDate.toLocaleTimeString()}
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
  if (summary.version) {
    informationTableContents.push(
      <tr key="version">
        <td className={classes.tdTitle}>Version</td>
        <td className={classes.tdContent}>{summary.version}</td>
      </tr>,
    )
  }
  if (summary.visibility) {
    if (
      summary.indexLevel &&
      (summary.indexLevel === 'ALL' || summary.indexLevel === 'META')
    ) {
      informationTableContents.push(
        <tr key="visibility">
          <td className={classes.tdTitle}>Visibility</td>
          <td className={classes.tdContent} valign="middle">
            P{summary.visibility.toLowerCase().slice(1)} (searchable)
          </td>
        </tr>,
      )
    } else {
      informationTableContents.push(
        <tr key="visibility">
          <td className={classes.tdTitle}>Visibility</td>
          <td className={classes.tdContent}>
            P{summary.visibility.toLowerCase().slice(1)} (not searchable)
          </td>
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
  let rights
  let rightsHolder
  let reference
  for (let property of properties) {
    const value = property.value.trim()
    const predicate = property.predicateString.trim()
    if (value !== '' && !predicate.startsWith(HIDDEN_ATTR_PREFIX)) {
      if (predicate === '@context') {
        continue
      } else if (predicate === 'rights') {
        if (value.includes('|')) {
          const [url, text] = value.split('|')
          rights = '<a target="_blank" href="' + url + '">' + text + '</a>'
        } else {
          rights = value
        }
      } else if (predicate === 'rightsHolder') {
        rightsHolder = value
      } else if (predicate === 'reference') {
        reference = value
      } else {
        propertiesTableContent.push(
          <tr key={predicate}>
            <td className={classes.tdTitle}>{formatTitle(predicate)}</td>
            <td className={classes.tdContent}>{formatPropertyValue(value)}</td>
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
    descriptionList.push([null, formatDescription(description)])
  }
  if (rights || rightsHolder) {
    const rightsTable = (
      <table className={classes.table}>
        <tbody>
          {rights ? (
            <tr>
              <td className={classes.tdTitle}>Rights</td>
              <td className={classes.tdContent}>
                {formatPropertyValue(rights)}
              </td>
            </tr>
          ) : null}
          {rightsHolder ? (
            <tr>
              <td className={classes.tdTitle}>Rights holder</td>
              <td className={classes.tdContent}>
                {formatPropertyValue(rightsHolder)}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    )
    descriptionList.push(['Rights', rightsTable])
  }
  if (reference) {
    descriptionList.push(['Reference', formatPropertyValue(reference)])
  }
  if (descriptionList.length > 0) {
    descriptionDisplay = formatDisplay(descriptionList)
  }

  let darkBackground = 0
  return (
    <div className={classes.wrapper}>
      <div className={classes.innerWrapper}>
        {informationDisplay ? (
          <CollapsiblePanel
            title="Network information"
            children={informationDisplay}
            backgroundColor={darkBackground++ % 2 === 0 ? 'inherit' : 'white'}
            open={panelState.netInfoOpen}
            setOpen={_handleInfoOpen}
          />
        ) : null}
        {descriptionDisplay ? (
          <CollapsiblePanel
            title="Description"
            children={descriptionDisplay}
            backgroundColor={darkBackground++ % 2 === 0 ? 'inherit' : 'white'}
            open={panelState.descriptionOpen}
            setOpen={_handleDescriptionOpen}
          />
        ) : null}
        {propertiesDisplay ? (
          <CollapsiblePanel
            title="Properties"
            children={propertiesDisplay}
            backgroundColor={darkBackground++ % 2 === 0 ? 'inherit' : 'white'}
            open={panelState.propsOpen}
            setOpen={_handlePropsOpen}
          />
        ) : null}
      </div>
    </div>
  )
}

const formatTitle = (string) => {
  if (string === undefined) {
    return
  }
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const formatPropertyValue = (value: string) => {
  if (value === undefined) {
    return null
  }

  let processedValue: string = value
    .toString()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\ *>/gi, '')
  const parsedValue = parse(processedValue)
  return <Linkify key={`key-${Math.random()}`}>{parsedValue}</Linkify>
}

const formatDescription = (string) => {
  if (string === undefined) {
    return
  }
  string = string
    .toString()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\ *>/gi, '')
  string = parse(string)
  return string
}

const formatDisplay = (propertiesList) => {
  const display = []
  let index = 0
  for (let property of propertiesList) {
    display.push(
      <NetworkPropertySegment
        summary={property[0]}
        details={property[1]}
        key={index++}
      />,
    )
  }
  return display
}

export default NetworkProperties
