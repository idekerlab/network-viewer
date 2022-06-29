export const NetworkQueryParams = {
  // Query string for NDEx network query API
  Query: 'query',

  // Type of Query
  QueryType: 'queryType',

  // Maximize the query result view 
  MaximizeResultView: 'maximizeResultView',
} as const

// Data type of these parameters
export type NetworkQueryParamsType =
  typeof NetworkQueryParams[keyof typeof NetworkQueryParams]
