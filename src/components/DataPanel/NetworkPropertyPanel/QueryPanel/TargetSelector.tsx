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
  selected: TargetNodes
  setSelected: (selected: TargetNodes) => void
}> = ({
  selectionState,
  showSearchResult,
  selected = TargetNodes.All,
  setSelected,
}): ReactElement => {
  const classes = useStyles()

  useEffect(() => {

    if(showSearchResult) {
      setSelected(TargetNodes.AllResult)

    }
  }, [showSearchResult])

  useEffect(() => {
    if (showSearchResult) {
      return
    }
    const mainSelection = selectionState.main
    const mainSelectedNodes = mainSelection['nodes']

    if (mainSelectedNodes.length !== 0) {
      setSelected(TargetNodes.Selected)
    } else {
      setSelected(TargetNodes.All)
    }
  }, [selectionState.main])

  useEffect(() => {
    if (!showSearchResult) {
      return
    }

    const subSelection = selectionState.sub
    const subSelectedNodes = subSelection['nodes']

    if (subSelectedNodes.length !== 0) {
      setSelected(TargetNodes.SelectedResult)
    } else {
      setSelected(TargetNodes.AllResult)
    }
  }, [selectionState.sub])

  const _handleChange = (event) => {
    const { target } = event
    const selectedValue: TargetNodes = target.value as TargetNodes
    console.log('Event', selectedValue)
    setSelected(selectedValue)
  }

  // const getTarget = (selectionState: SelectionState): TargetNodes => {
  //   if (!showSearchResult) {
  //     // Main view only.
  //     const mainSelection = selectionState.main
  //     const mainSelectedNodes = mainSelection['nodes']

  //     if (mainSelectedNodes.length === 0) {
  //       return selected
  //     } else {
  //       return TargetNodes.Selected
  //     }
  //   } else {
  //     const subSelection = selectionState.sub
  //     const subSelectedNodes = subSelection['nodes']

  //     if (subSelectedNodes.length === 0) {
  //       return selected
  //     } else {
  //       return TargetNodes.SelectedResult
  //     }
  //   }
  // }

  const entries: TargetNodes[] = showSearchResult ? SUB : MAIN

  return (
    <FormControl variant="standard" className={classes.formControl}>
      <InputLabel htmlFor="attr-selector">attribute of</InputLabel>
      <Select native value={selected} onChange={_handleChange}>
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
