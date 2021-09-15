import React, { FC } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { useContext, useState, useEffect } from 'react'
import AppContext from '../../context/AppState'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import ListIcon from '@material-ui/icons/List'
import ScatterPlotIcon from '@material-ui/icons/ScatterPlot'

import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 40,
      height: '100%',
      position: 'absolute',
      backgroundColor: 'white',
      zIndex: 500,
      borderRight: '1px solid #DDDDDD',
    },
    currentPanel: {
      width: 300,
      padding: '2em',
      height: '100%',
      position: 'absolute',
      backgroundColor: 'white',
      zIndex: 600,
      borderRight: '1px solid #DDDDDD',
      left: 40,
    },
    buttonList: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '4em',
    },
    button: {
      height: '2em',
      width: '2em',
    },
    layoutButton: {},
    saveToNDExButton: {},
    title: {
      marginBottom: '1em',
    },
    progress: {
      zIndex: 700,
    },
  }),
)

type ViewProps = {
  cx: object[]
}

const LayoutPanel = ({ cx, cyReference }) => {
  const classes = useStyles()
  const [layoutAlgorithmsInfo, setLayoutAlgorithmsInfo] = useState({})
  const [layoutRunning, setLayoutRunning] = useState(false)
  const [layoutProgress, setLayoutProgress] = useState(null)
  const [layoutRunningName, setLayoutRunningName] = useState('')
  const saveToNDEx = () => {}

  const runLayout = (layoutName) => {
    const layoutParams = {
      algorithm: layoutName,
      data: cx,
    }
    setLayoutRunningName(layoutName)
    setLayoutRunning(true)

    fetch('http://cytolayouts.ucsd.edu/cd/communitydetection/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(layoutParams),
    })
      .then((res) => res.json())
      .then(({ id }) => {
        setTimeout(() => {
          fetch(`http://cytolayouts.ucsd.edu/cd/communitydetection/v1/${id}`)
            .then((res) => res.json())
            .then((res) => {
              if (res.result != null) {
                res.result.forEach(({ node, x, y }) => {
                  cyReference.main.getElementById(node).position({ x, y })
                })
              }
              setLayoutRunning(false)
              setLayoutRunningName('')
            })
        }, 2000)
      })
  }

  useEffect(() => {
    fetch('http://cytolayouts.ucsd.edu/cd/communitydetection/v1/algorithms')
      .then((res) => res.json())
      .then((res) => {
        setLayoutAlgorithmsInfo(res.algorithms)
      })
  }, [])

  const layoutInfoCards = Object.entries(layoutAlgorithmsInfo).map(([name, info]: any) => (
    <Card variant="outlined">
      <CardContent>
        <Typography gutterBottom variant="h6" component="h3">
          {info.displayName}
        </Typography>
        <Typography color="textSecondary">{info.description}</Typography>
      </CardContent>
      <CardActions>
        <Button color="primary" size="small" onClick={() => runLayout(name)}>
          Run Layout
        </Button>
        {layoutRunningName === name ? <CircularProgress color="secondary" /> : null}
      </CardActions>
    </Card>
  ))

  return (
    <div className={classes.currentPanel}>
      <Typography className={classes.title} variant="h6">
        Layouts
      </Typography>
      {layoutInfoCards}
    </div>
  )
}

const NetworkListPanel = ({ cx, cyReference }) => {
  const classes = useStyles()

  return (
    <div className={classes.currentPanel}>
      <h1>Network List</h1>
    </div>
  )
}

const getCurrentPanel = (currentPanel, cx, cyReference) => {
  switch (currentPanel) {
    case 'layouts':
      return <LayoutPanel cx={cx} cyReference={cyReference}></LayoutPanel>
    case 'networkList':
      return <NetworkListPanel cx={cx} cyReference={cyReference}></NetworkListPanel>
    case null:
      return null
    default:
      return null
  }
}

const ActionsBar: FC<ViewProps> = ({ cx }) => {
  const classes = useStyles()
  const { cyReference, uiState } = useContext(AppContext)
  const [currentPanel, setCurrentPanel] = useState(null)

  return (
    <React.Fragment>
      <div className={classes.root}>
        <div className={classes.buttonList}>
          <Tooltip title="View list of networks">
            <IconButton onClick={() => setCurrentPanel('networkList')}>
              <ListIcon></ListIcon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Layouts">
            <IconButton onClick={() => setCurrentPanel('layouts')}>
              <ScatterPlotIcon></ScatterPlotIcon>
            </IconButton>
          </Tooltip>
        </div>
      </div>
      {currentPanel != null ? getCurrentPanel(currentPanel, cx, cyReference) : null}
    </React.Fragment>
  )
}

export default ActionsBar
