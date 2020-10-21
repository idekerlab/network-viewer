import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import DownloadIcon from '@material-ui/icons/CloudDownload'

const ExportCxButton = ({cx, fileName}) => {
  let disabled = true
  if(cx !== undefined) {
    disabled = false
  }

  const exportCx = (content, fileName, contentType) => {
    const a = document.createElement('a')
    const file = new Blob([content], { type: contentType })
    a.href = URL.createObjectURL(file)
    a.download = fileName
    a.click()
  }

  const handleClick = () => {
    exportCx(JSON.stringify(cx), fileName, 'application/json')
  }

  return (
    <IconButton disabled={disabled} onClick={handleClick}>
      <DownloadIcon />
    </IconButton>
  )
}

export default ExportCxButton