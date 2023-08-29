import { makeStyles, Theme, createStyles } from '@material-ui/core'
import { blue } from '@material-ui/core/colors'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconButton: {
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    iconSmall: {
      color: '#FFFFFF',
      backgroundColor: blue[500],
      height: theme.spacing(3),
      width: theme.spacing(3),
    },
    iconMedium: {
      color: '#FFFFFF',
      backgroundColor: blue[500],
      height: theme.spacing(5),
      width: theme.spacing(5),
    },
    iconLarge: {
      color: '#FFFFFF',
      backgroundColor: blue[500],
      height: theme.spacing(7),
      width: theme.spacing(7),
    },
    logoutIconSmall: {
      color: blue[500],
      height: theme.spacing(3),
      width: theme.spacing(3),
    },
    logoutIconMedium: {
      color: blue[500],
      height: theme.spacing(5),
      width: theme.spacing(5),
    },
    logoutIconLarge: {
      color: blue[500],
      height: theme.spacing(7),
      width: theme.spacing(7),
    },
  }),
)
