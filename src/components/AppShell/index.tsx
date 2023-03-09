import { FC } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import AppContext from '../../context/AppState'
import { useContext } from 'react'
import CoreComponents from './CoreComponents'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appShell: {
      width: '100%',
      height: '100%',
      padding: 0,
      margin: 0,
      boxSizing: 'border-box',
    },
    sandbox: {
      position: 'absolute',
      left: '-999em',
    },
  }),
)

const AppShell: FC = () => {
  const classes = useStyles()
  // const { config } = useContext(AppContext)

  return (
    <div className={classes.appShell}>
      <CoreComponents />
      <div id="sandbox"></div>
    </div>
  )
}

export default AppShell
