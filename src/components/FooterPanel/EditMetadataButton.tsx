import React, { FC, useContext } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import AppContext from '../../context/AppState'

const useStyles = makeStyles((theme: Theme) => createStyles({}))

const EditMetadataButton: FC = () => {
  const classes = useStyles()
  const { summary, ndexCredential } = useContext(AppContext)

  const onClick = () => {
    console.log(summary)
    console.log(ndexCredential)
  }

  if (
    ndexCredential.isLogin &&
    !ndexCredential.isGoogle &&
    summary !== undefined &&
    ndexCredential.basic.userId === summary.owner
  ) {
    return (
      <IconButton href={'https://dev.ndexbio.org/#/properties/network/' + summary.externalId + '/null'} target="_blank">
        <EditIcon />
      </IconButton>
    )
  }
  return null
}

export default EditMetadataButton
