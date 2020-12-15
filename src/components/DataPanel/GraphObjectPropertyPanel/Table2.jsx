/*
Same as Table.jsx. Done this way to force the table to completely reload instead
of trying to refresh, which doesn't work.
Sorry.
*/

import React from 'react'
import Table from './Table'

function Table2({ columns, data }) {
  return <Table columns={columns} data={data} />
}

export default Table2
