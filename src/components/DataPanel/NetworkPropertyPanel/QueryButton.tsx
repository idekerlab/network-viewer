import { Button, FormControl, InputLabel, makeStyles, MenuItem, Select, Tooltip } from '@material-ui/core'
import React, { useContext, useState, useEffect } from 'react'
import AppContext from '../../../context/AppState'
import useAttributes from '../../../hooks/useAttributes'
import { useParams } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    '& .MuiInputBase-root': {
      fontSize: 'inherit',
    },
  },
  button: {
    '&.MuiButton-contained': {
      backgroundColor: '#1565c0',
      margin: theme.spacing(1),
    },
  },
}))

const QueryButton = (props) => {
  //Parameters
  const classes = useStyles()
  const { selectionState, uiState } = useContext(AppContext)
  const { uuid } = useParams()
  const { cx } = props
  const allNodeAttributes = useAttributes(uuid, cx, uiState.mainNetworkNotDisplayed)['nodeAttr']

  //State information
  const [selectedNodes, setSelectedNodes] = useState([])
  const [chosenAttribute, setChosenAttribute] = useState(0)
  const [availableAttributes, setAvailableAttributes] = useState([])
  const [chosenQuery, setChosenQuery] = useState(0)
  const availableQueries = ['IQuery', 'MSigDB']
  const availableQueryUrls = [
    'http://iquery.ndexbio.org/?genes=',
    'https://www.gsea-msigdb.org/gsea/msigdb/annotate.jsp?geneIdList=',
  ]
  const [queryURL, setQueryURL] = useState('')

  //Button state:
  // 0 = disabled, no nodes selected
  // 1 = enabled
  // 2 = disabled, too many nodes selected
  const [buttonState, setButtonState] = useState(0)
  const queryDelimiters = [', ', ',']
  const maxQueryLengths = [8200, null]
  const tooltipMessages = ['Select nodes to run a query', '', 'Too many nodes were selected. Try a smaller number.']

  //Get available node attributes
  useEffect(() => {
    let nodes
    if (selectionState.lastSelected.fromMain) {
      nodes = selectionState.main['nodes']
    } else {
      nodes = selectionState.sub['nodes']
    }
    setSelectedNodes(nodes)

    const availableAttributesTemp = new Set()
    if (allNodeAttributes !== undefined) {
      for (let node of nodes) {
        const nodeAttributes = allNodeAttributes[node]
        if (nodeAttributes !== undefined) {
          const nodeAttributeNames = Array.from(nodeAttributes.keys())
          for (let attributeName of nodeAttributeNames) {
            availableAttributesTemp.add(attributeName)
          }
        }
      }
    }
    //Check if old current attribute is in new list
    const availableAttributesTempList = Array.from(availableAttributesTemp)
    setAvailableAttributes(availableAttributesTempList)

    const newIndex = availableAttributesTempList.indexOf(availableAttributes[chosenAttribute])
    if (newIndex === -1) {
      setChosenAttribute(0)
    } else {
      setChosenAttribute(newIndex)
    }
  }, [selectionState])

  //Check what button state should be
  useEffect(() => {
    //Check if any nodes selected
    if (selectedNodes.length === 0) {
      setButtonState(0)
    } else {
      //Find node names to build query string
      const nodeNames = []
      const chosenAttributeName = availableAttributes[chosenAttribute]
      if (allNodeAttributes !== undefined) {
        for (let node of selectedNodes) {
          const nodeAttributes = allNodeAttributes[node]
          if (nodeAttributes !== undefined) {
            const attribute = nodeAttributes.get(chosenAttributeName)
            if (attribute !== undefined) {
              nodeNames.push(attribute)
            }
          }
        }
      }
      //Build query string
      let urlString = availableQueryUrls[chosenQuery]
      const delimiter = queryDelimiters[chosenQuery]
      for (let name of nodeNames) {
        urlString += name + delimiter
      }
      urlString = urlString.slice(0, -delimiter.length)
      //Check if currently selected query type has length limit
      if (maxQueryLengths[chosenQuery] == null) {
        setButtonState(1)
        setQueryURL(urlString)
      } else {
        //Compare query string to max length
        if (urlString.length > maxQueryLengths[chosenQuery]) {
          setButtonState(2)
        } else {
          setButtonState(1)
          setQueryURL(urlString)
        }
      }
    }
  }, [selectedNodes, chosenQuery, chosenAttribute])

  //Handle menu changes
  const handleQueryMenuChange = (event) => {
    setChosenQuery(event.target.value)
  }
  const handleAttributeMenuChange = (event) => {
    setChosenAttribute(event.target.value)
    console.log(availableAttributes[chosenAttribute])
  }

  //Handle button click and query
  const handleButtonClick = () => {
    window.open(queryURL, '_blank')
  }

  return (
    <>
      Query
      <FormControl variant="standard" className={classes.formControl}>
        <Select native value={chosenQuery} onChange={handleQueryMenuChange}>
          {availableQueries.map((name, index) => (
            <option key={name} value={index}>
              {name}
            </option>
          ))}
        </Select>
      </FormControl>
      using the
      <FormControl variant="standard" className={classes.formControl}>
        <Select native value={chosenAttribute} onChange={handleAttributeMenuChange}>
          {availableAttributes.map((name, index) => (
            <option key={name} value={index}>
              {name}
            </option>
          ))}
        </Select>
      </FormControl>
      attribute of selected nodes.
      {buttonState === 1 ? (
        <Button variant="contained" color="primary" className={classes.button} onClick={handleButtonClick}>
          Go
        </Button>
      ) : (
        <Tooltip arrow title={<span style={{ fontSize: '0.875rem' }}>{tooltipMessages[buttonState]}</span>}>
          <span>
            <Button variant="contained" color="primary" className={classes.button} onClick={handleButtonClick} disabled>
              Go
            </Button>
          </span>
        </Tooltip>
      )}
    </>
  )
}

export default QueryButton
