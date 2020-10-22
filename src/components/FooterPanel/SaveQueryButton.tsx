import React, { useContext } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { useParams } from 'react-router-dom'
import useSearch from '../../hooks/useSearch'
import AppContext from '../../context/AppState'
import Snackbar from '@material-ui/core/Snackbar'

import { SaveToNDExButton } from 'cytoscape-explore-components'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      height: '2em',
      width: '2em',
      borderRadius: 2,
    },
  }),
)

const SaveQueryButton = () => {
  const { uuid } = useParams()

  const { query, queryMode, uiState, ndexCredential, config } = useContext(AppContext)
  const searchResult = useSearch(uuid, query, config.ndexHttps, ndexCredential, queryMode)

  const subnet = searchResult.data
  const subCx = subnet !== undefined ? subnet['cx'] : undefined

  const fetchCX = () => {
    return new Promise<Object>(function (resolve, reject) {
      console.log(JSON.stringify(subCx))
      resolve(subCx)
    })
  }

  const [snackMessage, setSnackMessage] = React.useState(undefined)

  const onSuccess = (data) => {
    console.log(data)
    setSnackMessage('Network saved to NDEx.')
  }

  const onFailure = (err) => {
    setSnackMessage('Failed to Save network: ' + err)
  }

  const handleClose = () => {
    setSnackMessage(undefined)
  }

  if (uiState.showSearchResult) {
    return (
      <div>
        <SaveToNDExButton
          disabled={subCx == undefined}
          fetchCX={fetchCX}
          onSuccess={onSuccess}
          onFailure={onFailure}
          tooltip="Save to NDEx"
        />
        <Snackbar
          open={snackMessage != undefined}
          autoHideDuration={6000}
          onClose={handleClose}
          message={snackMessage}
        />
      </div>
    )
  } else {
    return <SaveToNDExButton disabled />
  }
}

export default SaveQueryButton
