import { cx2cyjs } from '../utils/cx2cyjs'
import { useState } from 'react'

export default function useCyjs(uuid: string, cx: any) {
  const [cyjs, setCyjs] = useState(null)
  const [id, setUuid] = useState(null)


  if(cx === undefined || cx === null) {
    return {}
  }

  if (id === null && cx.length > 6) {
    setUuid(uuid)
    setCyjs(cx2cyjs(uuid, cx))
    return cyjs
  }

  if (id === uuid) {
    return cyjs
  }

  return {}
}
