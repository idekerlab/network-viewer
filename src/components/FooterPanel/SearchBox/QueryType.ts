export const QueryType = {
  direct: 'Direct',
  firstStepNeighborhood: '1-Step Neighborhood',
  firstStepAdjacent: '1-step adjacent',
  interconnect: 'Interconnect',
  twoStepNeighborhood: '2-step neighborhood',
  twoStepAdjacent: '2-step adjacent',
} as const

export type QueryType = keyof typeof QueryType