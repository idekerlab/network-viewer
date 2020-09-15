import React, { FC, useContext } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import SearchBox from './SearchBox'
import AdvancedMenu from './AdvancedMenu'
import { useParams } from 'react-router-dom'

import ExpandButton from './ExpandButton'
import { DownloadButton, DownloadProps, CyNDExProvider, OpenInCytoscapeButton } from 'cytoscape-explore-components'

import useSearch from '../../hooks/useSearch'
import AppContext from '../../context/AppState'
import OpenInCytoscape from './OpenInCytoscape'
import SaveNetworkToButton from './SaveNetworkToButton'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolBar: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      margin: 0,
      padding: 0,
      backgroundColor: 'rgba(255,255,255, 0.9)',
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

  const downloadProps: DownloadProps = {
    data: subCx,
    tooltip: 'Download query result as CX',
    fileName: `${uuid} subnet.cx`,
  }

  return (
    <Toolbar className={classes.toolBar} style={{ width: width }}>
      <SearchBox />
      <div className={classes.grow} />
      <DownloadButton {...downloadProps} />
      <SaveNetworkToButton />
      <OpenInCytoscape />
      <ExpandButton />
      <AdvancedMenu />
    </Toolbar>
  )
}

export default FooterPanel
