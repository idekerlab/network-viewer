import React, { FC, useContext } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import SearchBox from './SearchBox'
import AdvancedMenu from './AdvancedMenu'

import ExpandButton from './ExpandButton'

import OpenInCytoscape from './OpenInCytoscape'
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolBar: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      margin: 0,
      padding: 0,
      backgroundColor: 'rgba(255,255,255,0.93)',
    },
    grow: {
      flexGrow: 1,
    },
  }),
)

type FooterProps = {
  width: number
}

const FooterPanel: FC<FooterProps> = ({ width }: FooterProps) => {
  const classes = useStyles()

  return (
    <Toolbar variant='dense' className={classes.toolBar} style={{ width: width }}>
      <SearchBox />
     
      <Divider orientation="vertical" flexItem />
      <div className={classes.grow} />
      <OpenInCytoscape />
      <ExpandButton />
      <AdvancedMenu />
    </Toolbar>
  )
}

export default FooterPanel
