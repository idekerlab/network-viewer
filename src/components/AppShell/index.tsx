import React, { FC } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { NDExAccountProvider } from 'cytoscape-explore-components'
import MainSplitPane from '../MainSplitPane'
import ToolBar from '../ToolBar'
import AppContext from '../../context/AppState'
import { useContext } from 'react'
import FooterPanel from '../FooterPanel'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      display: 'flex',
      overflow: 'hidden',
      flexDirection: 'column',
      boxSizing: 'border-box',
    },
    header: {},
    main: {
      flexGrow: 1,
      overflow: 'hidden',
      background: '#EEEEEE',
      boxSizing: 'border-box',
    },
    footer: {
      overflow: 'hidden',
      boxSizing: 'border-box',
      padding: 0,
      margin:0,
      borderTop: '1px solid rgba(230,230,230,0.7)',
      width: '100%',
      height: '4em', //If this changes, also update footer size in Popup/index.tsx
    },
  }),
)

const AppShell: FC = () => {
  const classes = useStyles()
  const { config } = useContext(AppContext)

  return (
    <div className={classes.root}>
      <NDExAccountProvider ndexServerURL={config.ndexHttps}>
        <main className={classes.main}>
          <ToolBar />
          <MainSplitPane />
        </main>
        <footer className={classes.footer}>
          <FooterPanel />
        </footer>
      </NDExAccountProvider>
    </div>
  )
}

export default AppShell
