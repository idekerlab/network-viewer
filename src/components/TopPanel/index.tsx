import { useContext } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import logo from '../../assets/images/ndex-logo.svg'
import AppContext from '../../context/AppState'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'grid',
      width: '100%',
      height: '100%',
      placeItems: 'center',
    },
    item: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    message: {
      padding: '1em',
    },
    ndexLogo: {
      height: '20vh',
      padding: '1em',
      '&:hover': {
        cursor: 'pointer',
        color: theme.palette.secondary.main,
      },
    },
    link: {
      '&:hover': {
        fontWeight: 700,
        cursor: 'pointer',
        color: theme.palette.secondary.main,
      },
    },
  }),
)
const handleClick = (url: string): void => {
  window.open(url, '_self')
}

const TopPage = ({ config }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.item}>
        <img
          alt="NDEx Logo"
          src={logo}
          className={classes.ndexLogo}
          onClick={() => handleClick(config.ndexHttps)}
        />
        <Typography className={classes.message} variant="h4">
          Please specify UUID of the network
        </Typography>

        <Typography className={classes.link} variant="body1">
          Back to NDEx Home
        </Typography>
      </div>
    </div>
  )
}

export default TopPage
