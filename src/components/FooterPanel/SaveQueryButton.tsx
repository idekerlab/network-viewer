import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import useSearch from '../../hooks/useSearch'
import AppContext from '../../context/AppState'
import Snackbar from '@material-ui/core/Snackbar'
import { SaveToNdexButton } from '../SaveToNdexButton'

const SaveQueryButton = () => {
  const { uuid } = useParams()
  const { query, queryMode, uiState, ndexCredential, config, summary } =
    useContext(AppContext)
  const searchResult = useSearch(
    uuid,
    query,
    config.ndexHttps,
    ndexCredential,
    queryMode,
    config.maxEdgeQuery,
  )

  const isLogin: boolean = ndexCredential.authenticated

  const subnet = searchResult.data
  const edgeLimitExceeded: boolean =
    subnet !== undefined ? subnet['edgeLimitExceeded'] : false
  const summaryObjectCount = summary
    ? summary.subnetworkNodeCount + summary.subnetworkEdgeCount
    : 0

  const subCx =
    subnet !== undefined && summaryObjectCount > 0 ? subnet['cx'] : undefined

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
    let disabled = false
    if (subCx === undefined || edgeLimitExceeded || !isLogin) {
      disabled = true
    }
    return (
      <>
        <SaveToNdexButton
          disabled={disabled}
          onSuccess={onSuccess}
          onFailure={onFailure}
          subCx={subCx}
          showLoginTip={!isLogin}
        />
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={snackMessage !== undefined}
          autoHideDuration={1500}
          onClose={handleClose}
          message={snackMessage}
        />
      </>
    )
  } else {
    return <SaveToNdexButton disabled={true} />
  }
}

export default SaveQueryButton
