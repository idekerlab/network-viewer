import React, { useState, FC, ReactElement } from 'react'

import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  makeStyles,
  Select,
  Theme,
  Tooltip,
} from '@material-ui/core'

import TargetNodes from './TargetNodes'

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: '100%',
    padding: theme.spacing(2),
    paddingBottom: 0,
    margin: 0,
  },
  item: {
    paddingLeft: theme.spacing(1),
  },
  formControl: {
    width: '100%',
    '& .MuiInputBase-root': {
      fontSize: 'inherit',
    },
  },
  button: {
    width: '100%',
    '&.MuiButton-contained': {},
  },
  tooltipText: {
    fontSize: '0.875rem',
    textAlign: 'center',
    padding: theme.spacing(0.5),
    lineHeight: 1.15,
  },
  flexContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
}))

const ColumnSelector: FC<{ selected: TargetNodes }> = ({
  selected = TargetNodes.All,
}): ReactElement => {
  const classes = useStyles()

  const _handleChange = (event, value) => {
    console.log('Event', event, value)
  }

  return (
    <FormControl variant="standard" className={classes.formControl}>
      <InputLabel htmlFor="attr-selector">attribute of</InputLabel>
      <Select native value={selected} onChange={_handleChange}>
        {Object.entries(TargetNodes).map((val1, val2) => (
          <option key={val2} value={val1}>
            {val1}
          </option>
        ))}
      </Select>
    </FormControl>
  )
}

export default ColumnSelector
