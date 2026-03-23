import { Button, Tooltip, Menu, MenuItem } from '@material-ui/core'
import DownloadIcon from '@material-ui/icons/CloudDownload'
import { DownloadProps } from './DownloadProps'
import { useState } from 'react'

const DEF_FILENAME = 'ce-data.json'
const CONTENT_TYPE = 'application/json'

export const DownloadButton = ({
  data,
  fetchCX2,
  tooltip = 'Download as JSON',
  fileName = DEF_FILENAME,
}: DownloadProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  let disabled = true
  if (data !== undefined) {
    disabled = false
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (fetchCX2) {
      setAnchorEl(event.currentTarget)
    } else {
      downloadData(data, fileName)
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const downloadData = (contentData: any, name: string) => {
    const content = JSON.stringify(contentData)
    const a = document.createElement('a')
    const file = new Blob([content], { type: CONTENT_TYPE })
    a.href = URL.createObjectURL(file)
    a.download = name
    a.click()
  }

  const handleDownloadCX = () => {
    downloadData(data, fileName)
    handleClose()
  }

  const handleDownloadCX2 = async () => {
    if (fetchCX2) {
      try {
        const cx2Data = await fetchCX2()
        const cx2FileName = fileName.replace(/\.cx$/i, '') + '.cx2'
        downloadData(cx2Data, cx2FileName)
      } catch (e) {
        console.error('Failed to fetch CX2', e)
      }
    }
    handleClose()
  }

  return (
    <>
      <Tooltip title={tooltip}>
        <span>
          <Button disabled={disabled} onClick={handleClick}>
            <DownloadIcon />
          </Button>
        </span>
      </Tooltip>
      {fetchCX2 && (
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleDownloadCX}>Download as CX</MenuItem>
          <MenuItem onClick={handleDownloadCX2}>Download as CX2</MenuItem>
        </Menu>
      )}
    </>
  )
}
