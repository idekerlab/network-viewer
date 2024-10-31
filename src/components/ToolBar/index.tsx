import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import NdexHomeButton from './NdexHomeButton'
import AdvancedMenu from './AdvancedMenu'
import { NdexSignInButton } from '../NdexLogin/NdexSignInButton'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'fixed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      top: theme.spacing(1),
      left: theme.spacing(1),
      height: theme.spacing(6.5),
      padding: theme.spacing(1),
      backgroundColor: 'rgba(255,255,255, 0.9)',
      zIndex: 300,
      borderRadius: 5,
    },
  }),
)

const ToolBar = (): JSX.Element => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Grid container direction="row" alignItems="center" spacing={0}>
        <Grid container direction="row" alignItems="center">
          <NdexHomeButton />
          <NdexSignInButton />
          <AdvancedMenu />
        </Grid>
        <Grid container direction="row" alignItems="center"></Grid>
      </Grid>
    </div>
  )
}

export default ToolBar
