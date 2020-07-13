import React, { FC, useContext } from 'react'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'
import CytoscapeViewer from './CytoscapeViewer'
import LGRPanel from './LGRPanel'
import CytoscapeRenderer from '../CytoscapeRenderer'



const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      backgroundColor: '#FFFFFF',
    },
  }),
)
const NetworkPanel:FC = (props) => {
  const classes = useStyles()


  return <div className={classes.root}>
    {/* <CytoscapeViewer {...props} /> */}
    {/* <LGRPanel {...props} /> */}
    <CytoscapeRenderer {...props} />
  </div>
}

export default NetworkPanel
