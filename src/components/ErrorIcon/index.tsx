import React, { FC } from 'react'

import Error from '@material-ui/icons/ErrorOutline'
import Warning from '@material-ui/icons/WarningOutlined'
import Lock from '@material-ui/icons/LockOutlined'
import NotFound from '@material-ui/icons/HelpOutlined'
import ResponseCode from '../../utils/error/ResponseCode'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

/**
 *
 * Simple error icon factory component
 *
 * @returns
 */
const ErrorIcon: FC<{ code: ResponseCode; size?: string }> = ({
  code,
  size = '10em',
}) => {
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      errorIcon: {
        fontSize: size,
        color: getColor(code, theme),
      },
    }),
  )
  const classes = useStyles()

  if (code === ResponseCode.NotFound) {
    return <NotFound className={classes.errorIcon} />
  } else if (
    code === ResponseCode.Unauthorized ||
    code === ResponseCode.Forbidden
  ) {
    return <Lock className={classes.errorIcon} />
  } else if (code === ResponseCode.BadRequest) {
    return <Warning className={classes.errorIcon} />
  } else {
    return <Error className={classes.errorIcon} />
  }
}

const getColor = (code: ResponseCode, theme: Theme): string => {
  const { palette } = theme
  if (code === ResponseCode.NotFound || code === ResponseCode.Unauthorized) {
    return palette.info.main
  } else if (
    code === ResponseCode.BadRequest ||
    code === ResponseCode.Forbidden
  ) {
    return palette.warning.main
  } else {
    return palette.error.main
  }
}

export default ErrorIcon
