import React from 'react'
import Helmet from 'react-helmet'

const defaultTitle = 'NDEx Network Viewer 2.5'

const Title = ({ title }) => {
  return (
    <Helmet>
      <title>{title ? title : defaultTitle}</title>
    </Helmet>
  )
}

export default Title
