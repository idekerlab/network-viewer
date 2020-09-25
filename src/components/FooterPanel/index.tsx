import React, { FC, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import SearchBox from './SearchBox'
import AdvancedMenu from './AdvancedMenu'
import ExpandButton from './ExpandButton'
import OpenInCytoscape from './OpenInCytoscape'
import Divider from '@material-ui/core/Divider'

import SaveNetworkCXButton from './SaveNetworkCXButton'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolBar: {
      width: '100%',
      padding: '0.2em',
      backgroundColor: '#FFFFFF',
      boxSizing: 'border-box',
      borderTop: '1px solid rgba(220,220,220,0.7)'
    },
    grow: {
      flexGrow: 1,
    },
  }),
)


const FooterPanel: FC = () => {
  const classes = useStyles()

  return (
    <Toolbar variant='dense' className={classes.toolBar}>
      <SearchBox />
      <Divider orientation="vertical" flexItem />
      <div className={classes.grow} />
      <OpenInCytoscape />
      <SaveNetworkCXButton />
      <ExpandButton />
      <AdvancedMenu />
    </Toolbar>
  )
}

export default FooterPanel
