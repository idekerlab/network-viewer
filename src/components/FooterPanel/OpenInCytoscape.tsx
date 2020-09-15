import React, { FC, useContext } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { useParams } from 'react-router-dom'

import { CyNDExProvider, OpenInCytoscapeButton } from 'cytoscape-explore-components'

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

const OpenInCytoscape: FC = () => {
  const classes = useStyles()
  const { uuid } = useParams()

  const { query, queryMode } = useContext(AppContext)

  const onSuccess = () => {}

  const onFailure = () => {}

  return (
    <CyNDExProvider port={1234}>
      <OpenInCytoscapeButton size="small" onSuccess={onSuccess} onFailure={onFailure} />
    </CyNDExProvider>
  )
}

export default OpenInCytoscape
