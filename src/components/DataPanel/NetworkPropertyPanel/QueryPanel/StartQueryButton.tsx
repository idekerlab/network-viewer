import React, { FC, ReactElement } from 'react'
import { makeStyles, Theme, Button, Tooltip } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

const useStyles = makeStyles((theme: Theme) => ({
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
}))

const StartQueryButton: FC<{
  enabled: boolean
  message: string
  onClick: () => void
}> = ({ enabled, message, onClick }): ReactElement => {
  const classes = useStyles()

  const getButton = (disabled: boolean, variant, color) => (
    <Button
      variant={variant}
      color={color}
      disabled={disabled}
      size="small"
      className={classes.button}
      onClick={onClick}
      startIcon={<SearchIcon />}
    >
      Query
    </Button>
  )

  if (enabled) {
    return getButton(false, 'outlined', 'secondary')
  } else {
    return (
      <Tooltip
        arrow
        title={<div className={classes.tooltipText}>{message}</div>}
      >
        <span>{getButton(true, 'contained', 'primary')}</span>
      </Tooltip>
    )
  }
}

export default StartQueryButton
