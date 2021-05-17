import React, { FC, ReactElement } from 'react'

import {
  FormControl,
  InputLabel,
  makeStyles,
  Select,
  Theme,
} from '@material-ui/core'
import { DB } from './QueryState'

const useStyles = makeStyles((theme: Theme) => ({
  formControl: {
    width: '100%',
    '& .MuiInputBase-root': {
      fontSize: 'inherit',
    },
  },
}))

const DBSelector: FC<{
  selected: DB
  setSelected: (DB) => void
}> = ({ selected = DB.IQUERY, setSelected }): ReactElement => {
  const classes = useStyles()

  const _handleChange = (event) => {
    const { target } = event
    const selectedValue: string = target.value
    setSelected(selectedValue)
  }

  return (
    <FormControl variant="standard" className={classes.formControl}>
      <InputLabel shrink htmlFor="service-name">
        Database:
      </InputLabel>
      <Select
        native
        value={selected}
        onChange={_handleChange}
        inputProps={{
          name: 'service-name',
          id: 'service-name',
        }}
      >
        {Object.entries(DB).map((val: [string, string]) => (
          <option key={val[1]} value={val[1]}>
            {val[1]}
          </option>
        ))}
      </Select>
    </FormControl>
  )
}

export default DBSelector
