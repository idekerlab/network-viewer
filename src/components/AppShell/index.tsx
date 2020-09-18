import React, { FC } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { NDExAccountProvider } from 'cytoscape-explore-components'
import MainSplitPane from '../MainSplitPane'
import ToolBar from '../ToolBar'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flexGrow: 1,
      width: '100%',
      height: '100%'
    },
  }),
)

const AppShell: FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CssBaseline />
      <NDExAccountProvider ndexServerURL="http://dev.ndexbio.org">
        <ToolBar />

        <main className={classes.content}>
          <MainSplitPane />
        </main>
      </NDExAccountProvider>
    </div>
  )
}

export default AppShell
