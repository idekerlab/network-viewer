import React, { useContext, Suspense, useState } from 'react'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import DescriptionEditor from './DescriptionEditor'
import Button from '@material-ui/core/Button'
import { IconButton } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import PublicIcon from '@material-ui/icons/Public'
import PropertyTable from './PropertyTable'
import useNetworkSummary from '../../../hooks/useNetworkSummary'
import { useParams } from 'react-router-dom'
import MinimizeButton from './MinimizeButton'

const BASE_URL = 'http://dev.ndexbio.org/'
const API_VER = 'v2'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      overflowY: 'auto',
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
      marginBottom: theme.spacing(3),
      height: '4em',
    },
    title: {
      paddingLeft: theme.spacing(2)
    }
  }),
)

const NetworkPropertyPanel = () => {
  const classes = useStyles()
  const { uuid } = useParams()

  const summaryResponse = useNetworkSummary(uuid, BASE_URL, 'v2')
  const summary = summaryResponse.data

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
          <Grid container direction="row" justify="flex-start" alignItems="center" className={classes.topBar}>
            <MinimizeButton />
            <Typography className={classes.title} variant="h6" color="inherit">
              {summary['name']}
            </Typography>
          </Grid>
          <Grid container direction="row" justify="flex-start" alignItems="center" >
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
