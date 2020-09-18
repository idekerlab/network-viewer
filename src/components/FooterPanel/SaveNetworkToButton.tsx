import React, { useContext } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { useParams } from 'react-router-dom'
import useSearch from '../../hooks/useSearch'
import { IconButton } from '@material-ui/core'
import AppContext from '../../context/AppState'
import Tooltip from '@material-ui/core/Tooltip'
import Snackbar from '@material-ui/core/Snackbar';

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
  const subCx = subnet !== undefined ? subnet['cx'] : undefined;
  
  const fetchCX = () => {
    return new Promise<Object>(function(resolve, reject) {
      console.log(JSON.stringify(subCx));
      resolve(subCx);
    });
  }

  const [snackMessage, setSnackMessage] = React.useState(undefined);
 
  const onSuccess = (data) => {
    console.log(data);
    setSnackMessage('Network saved to NDEx.');
  }

  const onFailure = (err) => {
    setSnackMessage('Failed to Save network: ' + err);
  }

  const handleClose = () => {
    setSnackMessage(undefined);
  }

  if (uiState.showSearchResult) {
    return (
      <div>
     
      <SaveToNDExButton 
        disabled={ subCx == undefined }
        fetchCX={ fetchCX } 
        onSuccess={onSuccess} 
        onFailure={onFailure}
        tooltip="Save Query to NDEx"
        />
 
      <Snackbar open={snackMessage != undefined} 
      autoHideDuration={6000} 
      onClose={handleClose}
      message={snackMessage} />
      </div>
      )
  } else {
    return (
      <SaveToNDExButton disabled />
    )
  }
}

export default SaveNetworkToButton
