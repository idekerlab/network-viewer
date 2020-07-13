import React from 'react'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import SelectionList from './SelectionList'

import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      overflowY: 'auto',
      padding: 0,
      margin: 0,
      // backgroundColor: theme.palette.secondary.main,
    },
  }),
)

const GraphObjectPropertyPanel = (props) => {
  const classes = useStyles()

  const [value, setValue] = React.useState(1)

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue)
  }


  return (
    <SelectionList {...props}/>
    
  )
}

export default GraphObjectPropertyPanel

{/* <Paper square className={classes.root}>
      <Tabs
        value={value}
        indicatorColor="secondary"
        textColor="secondary"
        onChange={handleChange}
        aria-label="disabled tabs example"
      >
        <Tab label="Nodes" value={1}/>
        <Tab label="Edges" value={2}/>
      </Tabs>
    </Paper> */}