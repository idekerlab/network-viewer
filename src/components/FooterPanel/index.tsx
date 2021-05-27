import React, { FC } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import SearchBox from './SearchBox'
import OpenInCytoscape from './OpenInCytoscape'
import EditMetadataButton from './EditMetadataButton'
import ShareMenu from './ShareMenu'
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
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    grow: {
      flexGrow: 1,
    },
  }),
)

const FooterPanel: FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.toolBar}>
      <SearchBox />
      <div className={classes.grow} />
      <OpenInCytoscape />
      <SaveNetworkCXButton />
      <EditMetadataButton />
      <ShareMenu />
    </div>
  )
}

export default FooterPanel
