import { useState } from 'react'
import { getAttributeMap } from '../utils/cx2attr'

export default function useAttributes(uuid: string, cx: object[], subnetworkOnly: boolean) {
  const [attr, setAttr] = useState(null)
  const [id, setUuid] = useState(null)

  if (uuid === undefined || uuid === null || cx === undefined || cx === null || cx.length === 0) {
    return {}
  }

  if (subnetworkOnly) {
    return getAttributeMap(cx)
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
