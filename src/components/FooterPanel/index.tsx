import React, { FC, useContext } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import SearchBox from './SearchBox'
import AdvancedMenu from './AdvancedMenu'
import { useParams } from 'react-router-dom'

import cyLogo from '../../assets/images/cy-logo-orange.svg'
import ExpandButton from './ExpandButton'

import { OpenInCytoscapeButton, CyNDExProvider, NDExAccountProvider } from 'cytoscape-explore-ui'
import ExportCxButton from '../ExportCxButton'
import useSearch from '../../hooks/useSearch'
import AppContext from '../../context/AppState'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolBar: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      margin: 0,
      padding: 0,
      backgroundColor: 'rgba(255,255,255, 0.3)',
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

const FooterPanel: FC<FooterProps> = ({ width }: FooterProps) => {
  const classes = useStyles()
  const { uuid } = useParams()

  const { query, queryMode } = useContext(AppContext)
  const searchResult = useSearch(uuid, query, '', queryMode)

  const subnet = searchResult.data
  let subCx
  if (subnet !== undefined) {
    subCx = subnet['cx']
  }


  return (
    <Toolbar className={classes.toolBar} style={{ width: width }}>
      <SearchBox />
      <div className={classes.grow} />
      <IconButton aria-label="Open in Cytoscape Desktop">
        <img alt="Cy3 logo" src={cyLogo} className={classes.cyLogo} />
      </IconButton>
      <ExportCxButton  cx={subCx}/>
      <ExpandButton />
      <AdvancedMenu />
    </Toolbar>
  )
}

export default FooterPanel
