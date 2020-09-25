import React, { FC } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
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
    header: {

    },
    main: {
      flexGrow: 1,
      overflow: 'hidden',
      background: '#EEEEEE',
      boxSizing: 'border-box',
    },
    footer: {
      boxSizing: 'border-box',
    }
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
