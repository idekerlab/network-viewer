import React, { FC } from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Typography from '@material-ui/core/Typography'
import LinkIcon from '@material-ui/icons/Link'

import { getCurrentServer } from '../../utils/locationUtil'

const ShareLinkMenuItem: FC<{ uuid: string, disabled: boolean }> = ({
  uuid = '',
  disabled = false,
}) => {
  return (
    <MenuItem
    disabled={disabled}
      component="a"
      href={getCurrentServer() + '/#/access/network/' + uuid + '?returnto=nnv'}
    >
      <ListItemIcon>
        <LinkIcon fontSize="small" />
      </ListItemIcon>
      <Typography variant="inherit">Share</Typography>
    </MenuItem>
  )
}

export default ShareLinkMenuItem
