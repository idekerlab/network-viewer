import React, { FC } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { NDExAccountProvider } from 'cytoscape-explore-components'

import AppContext from '../../context/AppState'
import { useContext } from 'react'

import AccountSignUpPane from '../AccountSignUpPane' 





const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    accountShell: {
      width: '100%',
      height: '100%',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    }
  }),
)

const AccountShell: FC = () => {
  const classes = useStyles()
  const { config } = useContext(AppContext)

  

  return (
    <div className={classes.accountShell}>
      <NDExAccountProvider ndexServerURL={config.ndexHttps} googleClientId={config.googleClientId}>
        <AccountSignUpPane />
      </NDExAccountProvider>
    </div>
  )
}

export default AccountShell
