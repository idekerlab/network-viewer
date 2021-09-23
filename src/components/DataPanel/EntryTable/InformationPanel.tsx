import React, { FC } from 'react'
import MessageIcon from '@material-ui/icons/InfoOutlined'

type InformationPanelProps = {
  type: string
  count: number
  threshold: number
}

const InformationPanel: FC<InformationPanelProps> = ({
  type,
  count,
  threshold,
}: InformationPanelProps): React.ReactElement => {
  const message =
    `This network has large number of ${type}s (${count}). ` +
    `To display ${type} attributes, you can select up to ${threshold} ${type}s at a time.`

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'grid',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      <div style={{ padding: '2em' }}>
        <MessageIcon style={{ fontSize: '6em' }} />
        <h3>{message}</h3>
      </div>
    </div>
  )
}

export default InformationPanel
