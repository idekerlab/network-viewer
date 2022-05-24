import { FC } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import MainSplitPane from '../MainSplitPane'
import ToolBar from '../ToolBar'
import FooterPanel from '../FooterPanel'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    },
    main: {
      flexGrow: 1,
      background: '#EEEEEE',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      width: '100%',
      height: '100%',
    },
    footer: {
      boxSizing: 'border-box',
      zIndex: 500,
      padding: 0,
      margin: 0,
      borderTop: '1px solid rgba(230,230,230,0.7)',
      width: '100%',
      height: '4em', //If this changes, also update footer size in Popup/index.tsx
    },
  }),
)

const CoreComponents: FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <header>
        <ToolBar />
      </header>
      <main className={classes.main}>
        <MainSplitPane />
      </main>
      <footer className={classes.footer}>
        <FooterPanel />
      </footer>
    </div>
  )
}

export default CoreComponents
