import React, { FC, useContext, useEffect, useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import AppContext from '../../context/AppState'
import Tooltip from '@material-ui/core/Tooltip'
import { getNdexClient } from '../../utils/credentialUtil'

const EditMetadataButton: FC = () => {
  const { summary, ndexCredential } = useContext(AppContext)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    if (summary && ndexCredential.isLogin) {
      const ndexClient = getNdexClient('http://dev.ndexbio.org/v2', ndexCredential)
      ndexClient.getSignedInUser().then((result) => {
        if (ndexCredential.isGoogle) {
          if (result.emailAddress === ndexCredential.oauth['loginDetails'].profileObj.email) {
            if (!showButton) {
              setShowButton(true)
            }
          } else if (showButton) {
            setShowButton(false)
          }
        } else {
          if (result.userName === ndexCredential.basic.userId) {
            if (!showButton) {
              setShowButton(true)
            }
          } else if (showButton) {
            setShowButton(false)
          }
        }
      })
    } else if (showButton) {
      setShowButton(false)
    }
  }, [ndexCredential, summary])

  return showButton ? (
    <Tooltip title="Edit metadata" placement="top" arrow>
      <IconButton href={'https://dev.ndexbio.org/#/properties/network/' + summary.externalId + '/null'} target="_blank">
        <EditIcon />
      </IconButton>
    </Tooltip>
  ) : null
}

export default EditMetadataButton
