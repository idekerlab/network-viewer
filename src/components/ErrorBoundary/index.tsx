import React, { Component } from 'react'
import { Typography } from '@material-ui/core'

export default class ErrorBoundary extends Component {
  state = {
    hasError: false,
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.log({ error, errorInfo })
    this.setState({ hasError: true })
  }

  render() {
    const { hasError } = this.state
    if (hasError) {
      return (
        <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Typography variant="h4" style={{ margin: '1rem' }}>
              Sorry, there was an error loading this page.{' '}
            </Typography>
            <Typography
              onClick={() => {
                window.location.reload()
              }}
              color="secondary"
              variant="h5"
              style={{ cursor: 'pointer', margin: '1rem' }}
            >
              Click here to reload the page.
            </Typography>
            <Typography
              color="secondary"
              onClick={() => {
                window.open('https://home.ndexbio.org/report-a-bug/', '_blank')
              }}
              variant="h5"
              style={{ cursor: 'pointer', margin: '1rem' }}
            >
              Click here to report a bug.
            </Typography>
          </div>
        </div>
      )
    } else {
      return this.props.children
    }
  }
}
