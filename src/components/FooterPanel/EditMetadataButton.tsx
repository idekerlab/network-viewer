import React, { FC, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import AppContext from '../../context/AppState'
import useNetworkPermissions from '../../hooks/useNetworkPermissions'
const useStyles = makeStyles((theme: Theme) => createStyles({}))

const EditMetadataButton: FC = () => {
  const classes = useStyles()
  const { summary, ndexCredential, config } = useContext(AppContext)

  const { uuid } = useParams()

  const permissions = useNetworkPermissions(uuid, config.ndexHttps, 'v2', ndexCredential);

  const onClick = () => {
    console.log(summary)
    console.log(ndexCredential)
  }

  if (
    ndexCredential.isLogin &&
    summary !== undefined &&
    permissions && permissions.data === 'ADMIN'
  ) {
    return (
      <IconButton href={'https://dev.ndexbio.org/#/properties/network/' + summary.externalId + '/null?returnto=nnv'} >
        <EditIcon />
      </IconButton>
    )
  }
  return null
}

export default EditMetadataButton
