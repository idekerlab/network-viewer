import React, { FC } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { useContext, useState } from 'react'
import AppContext from '../../context/AppState'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import ListIcon from '@material-ui/icons/List'
import ScatterPlotIcon from '@material-ui/icons/ScatterPlot'

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
  }),
)

type ViewProps = {
  cx: object[]
}

const LayoutPanel = ({ cx, cyReference }) => {
  const classes = useStyles()

  const saveToNDEx = () => {}

  const runLayout = () => {
    const layoutParams = {
      algorithm: 'networkxspringlayout',
      data: cx,
    }

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
            })
        }, 2000)
      })
  }

  return (
    <div className={classes.currentPanel}>
      <h1>Layouts</h1>
      <button className={classes.layoutButton} onClick={runLayout}>
        Run Layout Service
      </button>
      <button className={classes.saveToNDExButton} onClick={saveToNDEx}>
        Save To NDEx
      </button>
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
  console.log('action bar')
  console.log(cyReference)
  console.log(uiState)

  console.log(currentPanel)

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
