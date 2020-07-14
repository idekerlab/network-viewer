import React, { useContext } from 'react'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import DescriptionEditor from './DescriptionEditor'
import Summary from '../../../model/Summary'
import Button from '@material-ui/core/Button'
import { IconButton } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import PublicIcon from '@material-ui/icons/Public'
import PropertyTable from './PropertyTable'
import AppContext from '../../../context/AppState'

const dummy =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      overflowY: 'auto',
      padding: '1em',
      margin: 0,
      // backgroundColor: theme.palette.secondary.main,
    },
    mainFeaturedPost: {
      position: 'relative',
      backgroundColor: theme.palette.grey[800],
      color: theme.palette.common.white,
      marginBottom: theme.spacing(1),
      backgroundImage: 'url(https://source.unsplash.com/random)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      backgroundColor: 'rgba(0,0,0,.3)',
    },
    editor: {
      position: 'relative',
      paddingTop: theme.spacing(0),
    },
    propTable: {
      width: '100%',
      paddingTop: theme.spacing(2),
    },
    countButton: {
      marginLeft: theme.spacing(1),
    },
    topBar: {
      height: '5em',
    },
  }),
)

const NetworkPropertyPanel = () => {
  const appContext = useContext(AppContext)
  const classes = useStyles()

  const { summary } = appContext

  if (summary === undefined || Object.entries(summary).length === 0) {
    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item md={12}></Grid>
        </Grid>
      </div>
    )
  }

  const newProps = {
    description: summary['description'],
  }
  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item md={12}>
          <Typography variant="h5" color="inherit" gutterBottom>
            {summary['name']}
          </Typography>
          <Grid container direction="row" justify="flex-start" alignItems="center" className={classes.topBar}>
            <IconButton edge="end" aria-label="account of current user" aria-haspopup="true" color="inherit">
              <PublicIcon />
            </IconButton>
            <Grid item className={classes.countButton}>
              <Button variant="outlined" color="secondary">
                Nodes: {summary['nodeCount']}
              </Button>
            </Grid>
            <Grid item className={classes.countButton}>
              <Button variant="outlined" color="secondary">
                Edges: {summary['edgeCount']}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={12}>
          <div className={classes.editor}>
            <Grid container direction="row" justify="flex-start" alignItems="center">
              <Typography variant="button" color="inherit" gutterBottom>
                Description:
              </Typography>
              <IconButton edge="end" aria-label="account of current user" aria-haspopup="true" color="inherit">
                <EditIcon />
              </IconButton>
            </Grid>
            <DescriptionEditor {...newProps} />
          </div>
        </Grid>
        <Grid item md={12}>
          <div className={classes.propTable}>
            <PropertyTable data={summary['properties']} />
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default NetworkPropertyPanel
