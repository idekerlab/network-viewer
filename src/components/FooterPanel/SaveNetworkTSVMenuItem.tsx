import React, { FC, ReactElement, useContext } from 'react'
import { useParams } from 'react-router-dom'
import useCx from '../../hooks/useCx'
import AppContext from '../../context/AppState'
import ExportTsvMenuItem from '../ExportTsvMenuItem'

const SaveNetworkTSVMenuItem: FC<{ setOpen: (boolean) => void }> = ({
  setOpen,
}): ReactElement => {
  const { uuid } = useParams()
  const { ndexCredential, config, summary } = useContext(AppContext)

  const objectCount = summary
    ? summary['edgeCount'] + summary['nodeCount']
    : null

  const { status, data } = useCx(
    uuid,
    config.ndexHttps,
    'v2',
    ndexCredential,
    config.maxNumObjects,
    objectCount,
  )

  const fileName = summary ? summary.name + '.tsv' : 'network.tsv'

  return (
    <ExportTsvMenuItem
      cx={status && status === 'success' ? data : null}
      fileName={fileName}
      setOpen={setOpen}
    />
  )
}

export default SaveNetworkTSVMenuItem
