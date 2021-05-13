import TargetNodes from './TargetNodes'

export enum DB {
  IQUERY = 'IQuery',
  MSIGDB = 'MSigDB',
}

const DB_URL = {
  [DB.IQUERY]: 'http://iquery.ndexbio.org/?genes=',
  [DB.MSIGDB]:
    'https://www.gsea-msigdb.org/gsea/analysisApi?speciesName=Human&username=ndex_user&op=annotate&geneIdList=',
}
type QueryState = {
  db: DB
  column: string
  target: TargetNodes
}

export default QueryState
