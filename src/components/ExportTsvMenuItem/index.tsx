import React, {useEffect} from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Typography from '@material-ui/core/Typography'
import DownloadIcon from '@material-ui/icons/CloudDownload'

import { cx2tsv } from '../../utils/cx2tsv'

const ExportTsvButton = ({cx, fileName}) => {
  
  let disabled = true
  if(cx !== undefined) {
    disabled = false
  }

  const exportTsv = (content, fileName, contentType) => {
    const a = document.createElement('a')
    const file = new Blob([content], { type: contentType })
    a.href = URL.createObjectURL(file)
    a.download = fileName
    a.click()
  }

  const handleClick = () => {
    const tsvString = cx2tsv(cx);
    exportTsv(tsvString, fileName, 'application/json')
  }

  return (
    <MenuItem onClick={ handleClick } disabled={disabled}>
    <ListItemIcon>
      <DownloadIcon fontSize="small" />
    </ListItemIcon>
    <Typography variant="inherit">Export TSV</Typography>
  </MenuItem>

  )
}

export default ExportTsvButton
