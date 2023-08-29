import { Button, Tooltip } from '@material-ui/core'
import DownloadIcon from '@material-ui/icons/CloudDownload'
import { DownloadProps } from './DownloadProps'

const DEF_FILENAME = 'ce-data.json'
const CONTENT_TYPE = 'application/json'

export const DownloadButton = ({
  data,
  tooltip = 'Download as JSON',
  fileName = DEF_FILENAME,
}: DownloadProps): JSX.Element => {
  let disabled = true
  if (data !== undefined) {
    disabled = false
  }

  const handleClick = () => {
    const content = JSON.stringify(data)
    const a = document.createElement('a')
    const file = new Blob([content], { type: CONTENT_TYPE })
    a.href = URL.createObjectURL(file)
    a.download = fileName
    a.click()
  }

  return (
    <Tooltip title={tooltip}>
      <span>
        <Button disabled={disabled} onClick={handleClick}>
          <DownloadIcon />
        </Button>
      </span>
    </Tooltip>
  )
}
