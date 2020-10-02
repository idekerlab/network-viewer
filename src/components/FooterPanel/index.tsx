import React, { FC } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import {AppBar, Toolbar} from '@material-ui/core'
import SearchBox from './SearchBox'
import ExpandButton from './ExpandButton'
import OpenInCytoscape from './OpenInCytoscape'
import EditMetadataButton from './EditMetadataButton'

import SaveNetworkCXButton from './SaveNetworkCXButton'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      height: '100%',
      backgroundColor: '#FFFFFF',
      boxSizing: 'border-box',
    },
    grow: {
      flexGrow: 1,
    },
  }),
)

const FooterPanel: FC = () => {
  const classes = useStyles()

  return (
    <div  className={classes.toolBar}>
      <SearchBox />
      <div className={classes.grow} />
      <OpenInCytoscape />
      <SaveNetworkCXButton />
      <EditMetadataButton />
      <ExpandButton />
    </div>

  )
}

export default FooterPanel
