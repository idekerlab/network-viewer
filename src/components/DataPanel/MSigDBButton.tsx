import { Button, FormControl, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core'
import React, { useContext, useState, useEffect } from 'react'
import AppContext from '../../context/AppState'
import useAttributes from '../../hooks/useAttributes'
import { useParams } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
}))

const MSigDBButton = (props) => {
  const classes = useStyles()
  const [value, setValue] = useState(null)
  const { selectionState, uiState } = useContext(AppContext)
  const { uuid } = useParams()
  const { cx } = props
  const attributes = useAttributes(uuid, cx, uiState.mainNetworkNotDisplayed)
  const [nodeAttributes, setNodeAttributes] = useState([])

  useEffect(() => {
    //Get node attributes
    let nodes = []
    let tempAttributes = new Set()
    if (selectionState.lastSelected.fromMain) {
      nodes = selectionState.main['nodes']
    } else {
      nodes = selectionState.sub['nodes']
    }
    const nodeAttrs = attributes['nodeAttr']
    if (nodeAttrs !== undefined) {
      for (let node in nodes) {
        const nodeInfo = nodeAttrs[node]
        if (nodeInfo !== undefined) {
          const nodeInfoKeys = Array.from(nodeInfo.keys())
          for (let key in nodeInfoKeys) {
            tempAttributes.add(nodeInfoKeys[key])
          }
        }
      }
      const tempAttributesList = Array.from(tempAttributes)
      setNodeAttributes(tempAttributesList)
      const first = tempAttributesList[0]
      setValue(first)
    }
  }, [selectionState])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const handleClick = () => {
    //Get node names
    let nodes = []
    if (selectionState.lastSelected.fromMain) {
      nodes = selectionState.main['nodes']
    } else {
      nodes = selectionState.sub['nodes']
    }
    const nodeAttrs = attributes['nodeAttr']
    const nodeNames = []
    if (nodeAttrs !== undefined) {
      for (let node in nodes) {
        const nodeInfo = nodeAttrs[node]
        if (nodeInfo !== undefined) {
          nodeNames.push(nodeAttrs[node].get(value))
        }
      }
    }

    //Build query string
    console.log(nodeNames)
    let url = 'https://www.gsea-msigdb.org/gsea/msigdb/annotate.jsp?geneIdList='
    for (let name of nodeNames) {
      url += name + ','
    }
    window.open(url, '_blank')
  }

  return nodeAttributes.length == 0 ? (
    <div />
  ) : (
    <div>
      Query MSigDB using the
      <FormControl variant="standard" className={classes.formControl}>
        <Select
          native
          value={value}
          onChange={handleChange}
          inputProps={{
            name: 'search type',
            id: 'search-type',
          }}
        >
          {nodeAttributes.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </Select>
      </FormControl>
      column{' '}
      <Button variant="contained" style={{ margin: '8px' }} onClick={handleClick}>
        Go
      </Button>
    </div>
  )
}

export default MSigDBButton
