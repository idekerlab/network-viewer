import React, { useContext } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { useParams } from 'react-router-dom'
import useSearch from '../../hooks/useSearch'
import { IconButton } from '@material-ui/core'
import AppContext from '../../context/AppState'
import Tooltip from '@material-ui/core/Tooltip'
import { SaveToNDExButton } from 'cytoscape-explore-components'

import UploadIcon from '@material-ui/icons/CloudUpload'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      height: '2em',
      width: '2em',
      borderRadius: 2,
    },
  }),
)

const SaveNetworkToButton = () => {
  const classes = useStyles()
  const { uuid } = useParams()

  const { query, queryMode, uiState } = useContext(AppContext)
  const searchResult = useSearch(uuid, query, '', queryMode)

  const subnet = searchResult.data
  let subCx
  if (subnet !== undefined) {
    subCx = subnet['cx']
  }

  const fetchCX = () => {
    return new Promise<Object>(function(resolve, reject) {
      console.log(JSON.stringify(subCx));
      resolve(subCx);
    });
  }

  if (uiState.showSearchResult) {
    return (
      <SaveToNDExButton fetchCX={ fetchCX }/>
    )
  } else {
    return (
      <SaveToNDExButton disabled />
    )
  }
}

export default SaveNetworkToButton
