import React, { FC, ReactElement, useEffect, useState } from 'react'

import {
  FormControl,
  InputLabel,
  makeStyles,
  Select,
  Theme,
} from '@material-ui/core'

import TargetNodes from './TargetNodes'
import SelectionState from '../../../../model/SelectionState'

const useStyles = makeStyles((theme: Theme) => ({
  formControl: {
    width: '100%',
    '& .MuiInputBase-root': {
      fontSize: 'inherit',
    },
  },
}))

const MAIN: TargetNodes[] = [TargetNodes.All, TargetNodes.Selected]
const SUB: TargetNodes[] = [TargetNodes.AllResult, TargetNodes.SelectedResult]

const TargetSelector: FC<{
  selectionState: SelectionState
  showSearchResult: boolean
  target: TargetNodes
  setTarget: (TargetNodes) => void
}> = ({
  selectionState,
  showSearchResult,
  target = TargetNodes.All,
  setTarget,
}): ReactElement => {
  const classes = useStyles()

  useEffect(() => {

    if(showSearchResult) {
      setTarget(TargetNodes.AllResult)

    }
  }, [showSearchResult])

  useEffect(() => {
    if (showSearchResult) {
      return
    }
    const mainSelection = selectionState.main
    const mainSelectedNodes = mainSelection['nodes']

    if (mainSelectedNodes.length !== 0) {
      setTarget(TargetNodes.Selected)
    } else {
      setTarget(TargetNodes.All)
    }
  }, [selectionState.main])

  useEffect(() => {
    if (!showSearchResult) {
      return
    }

    const subSelection = selectionState.sub
    const subSelectedNodes = subSelection['nodes']

    if (subSelectedNodes.length !== 0) {
      setTarget(TargetNodes.SelectedResult)
    } else {
      setTarget(TargetNodes.AllResult)
    }
  }, [selectionState.sub])

  const _handleChange = (event) => {
    const { target } = event
    const selectedValue: TargetNodes = target.value as TargetNodes
    console.log('Event', selectedValue)
    setTarget(selectedValue)
  }

  const entries: TargetNodes[] = showSearchResult ? SUB : MAIN

  return (
    <FormControl variant="standard" className={classes.formControl}>
      <InputLabel htmlFor="attr-selector">attribute of</InputLabel>
      <Select native value={target} onChange={_handleChange}>
        {entries.map((val: TargetNodes) => (
          <option key={val} value={val}>
            {val}
          </option>
        ))}
      </Select>
    </FormControl>
  )
}

export default TargetSelector
