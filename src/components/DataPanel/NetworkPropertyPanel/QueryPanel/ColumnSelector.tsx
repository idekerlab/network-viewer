import React, { FC, ReactElement } from 'react'

import {
  FormControl,
  InputLabel,
  makeStyles,
  Select,
  Theme,
} from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({
  formControl: {
    width: '100%',
    '& .MuiInputBase-root': {
      fontSize: 'inherit',
    },
  },
}))

const ColumnSelector: FC<{
  selected: string
  columns: string[]
  setSelected: (string) => void
}> = ({ selected = '', columns = [], setSelected }): ReactElement => {
  const classes = useStyles()

  const _handleChange = (event) => {
    const { target } = event
    const selectedValue: string = target.value
    setSelected(selectedValue)
  }

  return (
    <FormControl variant="standard" className={classes.formControl}>
      <InputLabel shrink htmlFor="attr-selector">
        using the data column
      </InputLabel>
      <Select
        native
        value={selected}
        onChange={_handleChange}
        inputProps={{
          name: 'attr-selector',
          id: 'attr-selector',
        }}
      >
        {columns.map((name: string) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </Select>
    </FormControl>
  )
}

export default ColumnSelector
