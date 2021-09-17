import React, { FC } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import useNetworkPermissions from '../../hooks/useNetworkPermissions'
import useNetworkSummary from '../../hooks/useNetworkSummary'

import AppContext from '../../context/AppState'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import ListIcon from '@material-ui/icons/List'
import ScatterPlotIcon from '@material-ui/icons/ScatterPlot'
import CloseIcon from '@material-ui/icons/Close'


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
    currentPanelHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1em',
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
    title: {},
    progress: {
      zIndex: 700,
    },
  }),
)

type ViewProps = {
  cx: object[]
}

const LayoutPanel = ({ cx, onClose }) => {
  const classes = useStyles()
  const [layoutAlgorithmsInfo, setLayoutAlgorithmsInfo] = useState({})
  const [layoutRunning, setLayoutRunning] = useState(false)
  const [layoutRunningName, setLayoutRunningName] = useState('')
  const { summary, cyReference, uiState, ndexCredential, config } = useContext(AppContext)
  const { uuid } = useParams()
  const { isLogin } = ndexCredential


  // logic copied from src/components/FooterPanel/EditMetadataButton.tsx
  // TODO export this to a common function, I just don't know where it should 
  // go right now and this is a prototype, so this code might not exist in the future
  
  // basic idea is to disable the button if the user doesnt have permissions to modify
  // the cartesian network aspect
  const getLayoutUpdatePermissions = () => {
    const permissions = useNetworkPermissions(
      uuid,
      config.ndexHttps,
      'v2',
      ndexCredential,
    )
  
    const summaryResponse = useNetworkSummary(
      uuid,
      config.ndexHttps,
      'v2',
      ndexCredential,
    )
    const networkSummary = summaryResponse.data
    let isDoiAvailable = false
    if (networkSummary !== undefined && networkSummary !== null) {
      const { doi } = summary
      if (doi !== undefined) {
        // DOI status available.
        isDoiAvailable = true
      }
    }

    let hasPermission = false
    if (
      permissions !== undefined &&
      permissions !== null &&
      permissions.data === 'ADMIN'
    ) {
      hasPermission = true
    }
  
    let login: boolean = false
    if (isLogin && summary !== undefined) {
      login = true
    }
  
    let message = 'This feature is only available to signed-in users'
  
    let disabled = true
    if (hasPermission && login) {
      if (isDoiAvailable) {
        message =
          'Network properties cannot be modified once a DOI has been requested or assigned'
      } else {
        message = 'Edit network properties'
        disabled = false
      }
    } else if (!hasPermission && login) {
      message = "You don't have permission to edit this network"
    }
    
    return { saveLayoutButtonMessage: message, disabled }
  }

  const { saveLayoutButtonMessage, disabled } = getLayoutUpdatePermissions();

  const saveLayoutAspectToNDEx = () => {
    if(disabled){
      return;
    }

    
  };

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
        // poll `numCompletionTries`.
        // If the task doesn't finish before then, give up

        let numCompletionTries = 5
        let waitForCompletion = async () => {
          let result = await fetch(`http://cytolayouts.ucsd.edu/cd/communitydetection/v1/${id}`)
          let resultJson = await result.json()

          if (resultJson.status === 'complete') {
            resultJson.result.forEach(({ node, x, y }) => {
              cyReference.main.getElementById(node).position({ x, y })
            })
            setLayoutRunning(false)
            setLayoutRunningName('')
          } else {
            if (numCompletionTries > 0) {
              numCompletionTries--
              // poll every second for completion
              setTimeout(() => waitForCompletion(), 1000)
            } else {
              setLayoutRunning(false)
              setLayoutRunningName('')
            }
          }
        }

        waitForCompletion()
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
      <div className={classes.currentPanelHeader}>
        <Typography className={classes.title} variant="h6">
          Layouts
        </Typography>
        <IconButton onClick={() => onClose(null)}>
            <CloseIcon></CloseIcon>
        </IconButton>
      </div>
      {layoutInfoCards}
      <Tooltip title={saveLayoutButtonMessage}>
        <Button disabled={disabled} color="primary" size="small" onClick={() => saveLayoutAspectToNDEx()}>
          Save Network Layout
        </Button>
      </Tooltip>
    </div>
  )
}

const NetworkListPanel = ({ cx, cyReference, onClose }) => {
  const classes = useStyles()

  return (
    <div className={classes.currentPanel}>
      <div className={classes.currentPanelHeader}>
        <Typography className={classes.title} variant="h6">
          Network List
        </Typography>
        <IconButton onClick={() => onClose(null)}>
            <CloseIcon></CloseIcon>
        </IconButton>
      </div>    
    </div>
  )
}

const getCurrentPanel = (currentPanel, cx, cyReference, onClose) => {
  switch (currentPanel) {
    case 'layouts':
      return <LayoutPanel cx={cx} onClose={onClose}></LayoutPanel>
    case 'networkList':
      return <NetworkListPanel cx={cx} cyReference={cyReference} onClose={onClose}></NetworkListPanel>
    case null:
      return null
    default:
      return null
  }
}

const ActionsBar: FC<ViewProps> = ({ cx }) => {
  const classes = useStyles()
  const { cyReference, uiState, ndexCredential, config } = useContext(AppContext)
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
      {currentPanel != null ? getCurrentPanel(currentPanel, cx, cyReference, setCurrentPanel) : null}
    </React.Fragment>
  )
}

export default ActionsBar
