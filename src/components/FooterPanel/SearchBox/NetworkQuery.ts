import { NetworkQueryParams } from '../../../utils/NetworkQueryParams'
import { QueryType } from './QueryType'

export type NetworkQuery = {
  [NetworkQueryParams.Query]?: string
  [NetworkQueryParams.QueryType]?: QueryType
  [NetworkQueryParams.MaximizeResultView]?: boolean
}
