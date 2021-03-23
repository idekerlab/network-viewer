import { NdexSignUpPanel } from 'cytoscape-explore-components'
import { handleNDExSignOn } from 'cytoscape-explore-components'

import { getCurrentServer } from '../../utils/locationUtil'

import React, { FC } from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

import AppContext from '../../context/AppState'
import { useContext } from 'react'

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


const AccountSignUpPane: FC = () => {
  const classes = useStyles()
  const { config } = useContext(AppContext)

  const baseUrl: string = getCurrentServer();

  const onSuccessLogin = () => {
    console.log("Here we are.");
  }

  return (
    <NdexSignUpPanel handleNDExSignOn={handleNDExSignOn} onSuccessLogin={onSuccessLogin}/>
  )
}

export default AccountSignUpPane