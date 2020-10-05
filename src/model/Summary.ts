type Summary = {
  name?: string
  completed?: boolean
  creationTime?: number
  description?: string
  externalId?: string
  hasLayout?: boolean
  hasSample?: boolean
  indexLevel?: string
  isCertified?: boolean
  isDeleted?: boolean
  isReadOnly?: boolean
  isShowcase?: boolean
  isValid?: boolean
  modificationTime?: number
  nodeCount?: number
  owner?: string
  ownerUUID?: string
  properties?: object[]
  subnetworkIds?: string[]
  version?: string
  visibility?: string
  warnings?: string[]
  subnetworkNodeCount?: number
  subnetworkEdgeCount?: number
}

export default Summary
