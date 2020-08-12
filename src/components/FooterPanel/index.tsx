import React, { FC } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import SearchBox from './SearchBox'
import AdvancedMenu from './AdvancedMenu'

import cyLogo from '../../assets/images/cy-logo-orange.svg'
import ExpandButton from './ExpandButton'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolBar: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      margin: 0,
      padding: 0,
    },
    grow: {
      flexGrow: 1,
    },
    cyLogo: {
      width: '1.2em',
    },
  }),
)

type FooterProps = {
  width: number
}

const FooterPanel: FC<FooterProps> = ({width}: FooterProps) => {
  const classes = useStyles()

  return (
    <Toolbar className={classes.toolBar} style={{width: width}}>
      <SearchBox />
      <div className={classes.grow} />
      <IconButton aria-label="Open in Cytoscape Desktop">
        <img alt="Cy3 logo" src={cyLogo} className={classes.cyLogo} />
      </IconButton>
      <ExpandButton />
      <AdvancedMenu />
    </Toolbar>
  )
}

export default FooterPanel
