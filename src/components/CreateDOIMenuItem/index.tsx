import React, { FC } from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Typography from '@material-ui/core/Typography'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'

import { getCurrentServer } from '../../utils/locationUtil'

//http://dev.ndexbio.org/#/properties/network/9a17d903-85b9-11eb-8e98-525400c25d22/null?doi=true

const CreateDOIMenuItem: FC<{ uuid: string; disabled: boolean }> = ({
  uuid = '',
  disabled = false,
}): React.ReactElement => (
  <MenuItem
    disabled={disabled}
    component="a"
    href={
      getCurrentServer() +
      '/#/properties/network/' +
      uuid +
      '/null?doi=true&returnto=nnv'
    }
  >
    <ListItemIcon>
      <LibraryBooksIcon fontSize="small" />
    </ListItemIcon>
    <Typography variant="inherit">Request DOI</Typography>
  </MenuItem>
)

export default CreateDOIMenuItem
