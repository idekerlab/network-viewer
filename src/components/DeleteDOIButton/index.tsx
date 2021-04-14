import React from 'react'
import Button from '@material-ui/core/Button'
import ClearIcon from '@material-ui/icons/Clear'
import { Tooltip } from '@material-ui/core'

const DeleteDOIButton = ({ uuid }) => {
  let disabled = true

  const handleClick = () => {

  }
  
  return (
    <Tooltip title="">
      <Button disabled={disabled} onClick={handleClick} startIcon={<ClearIcon />}>
       Delete DOI Request
      </Button>
    </Tooltip>
  )
}

export default DeleteDOIButton
