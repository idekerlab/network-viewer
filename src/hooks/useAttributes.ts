import { useState } from 'react'
import { getAttributeMap } from '../utils/cx2attr'

export default function useAttributes(uuid: string, cx: object[]) {
  const [attr, setAttr] = useState(null)
  const [id, setUuid] = useState(null)

  if(uuid === undefined || uuid === null || cx === undefined || cx === null || cx.length === 0) {
    return {}
  }

  if (id === null) {
    setUuid(uuid)
    const attr = getAttributeMap(cx)
    setAttr(attr)
    return attr
  }

  if (id === uuid) {
    return attr
  }

  return {}
}
