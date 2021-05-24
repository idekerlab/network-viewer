import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { NDExAccountProvider } from 'cytoscape-explore-components'

import AppContext from '../../context/AppState'
import { useContext, FC } from 'react'
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    accountShell: {
      width: '100%',
      height: '100vh',
      padding: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      boxSizing: 'border-box',
    },
  }),
)

const AccountShell: FC = (props) => {
  const classes = useStyles()
  const { config } = useContext(AppContext)

  return (
    <div className={classes.accountShell}>
      <NDExAccountProvider
        ndexServerURL={config.ndexHttps}
        googleClientId={config.googleClientId}
      >
        {props.children}
      </NDExAccountProvider>
    </div>
  )
}

AccountShell.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AccountShell
