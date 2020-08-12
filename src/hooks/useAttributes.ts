import { useState } from 'react'
import { getAttributeMap } from '../utils/cx2attr'

export default function useAttributes(uuid: string, cx: object[]) {
  const [attr, setAttr] = useState(null)
  const [id, setUuid] = useState(null)

  if(uuid === undefined || uuid === null || cx === undefined || cx === null) {
    return {}
  }

  if (id === null) {
    setUuid(uuid)
    const attr = getAttributeMap(cx)
    setAttr(attr)

    console.log('----ATTRIBUTES  processed::', attr, cx)
    return attr
  }

  if (id === uuid) {
    return attr
  }

  return {}
}
