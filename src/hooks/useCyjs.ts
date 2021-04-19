import { cx2cyjs } from '../utils/cx2cyjs'
import { useState } from 'react'
import NDExError from '../utils/error/NDExError'

export default function useCyjs(uuid: string, cx: object[]) {
  const [cyjs, setCyjs] = useState(null)
  const [id, setUuid] = useState(null)


  if(cx === undefined || cx === null) {
    return {}
  }

  if (id === null && cx.length >= 6) {
    setUuid(uuid)

    try {
      setCyjs(cx2cyjs(uuid, cx))
      return cyjs
    } catch(e: unknown) {
      throw new NDExError('Data conversion from CX to Cytoscape.js failed', e)
    }
  }

  if (id === uuid) {
    return cyjs
  }

  return {}
}
