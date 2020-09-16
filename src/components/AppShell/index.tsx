import React, { useState, FC } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { NDExAccountProvider } from 'cytoscape-explore-components'
import MainSplitPane from '../MainSplitPane'
import ToolBar from '../ToolBar'
import ErrorDialog from './ErrorDialog'

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
      height: '100%',
    },
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
  }),
)



const AppShell: FC = (props) => {
  const classes = useStyles()

  const [openDialog, setOpenDialog] = useState(false)

  return (
    <div className={classes.root}>
      <CssBaseline />
      <NDExAccountProvider ndexServerURL="http://dev.ndexbio.org">
      <ToolBar />

      <main className={classes.content}>
        <MainSplitPane />
      </main>
      <ErrorDialog open={openDialog} setOpen={setOpenDialog} />
      </NDExAccountProvider>
    </div>
  )
}

export default AppShell
