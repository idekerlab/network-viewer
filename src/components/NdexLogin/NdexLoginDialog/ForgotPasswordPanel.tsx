import React, { useContext, useState } from 'react'
import { TextField, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { useResetPassword } from '../../../api/ndex'
import AppContext from '../../../context/AppState'

const useStyles = makeStyles({
  root: {
    padding: '0.6em',
    width: '40em',
    height: '7em',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textArea: {
    flexGrow: 1,
    marginRight: '0.3em',
  },
  itemRight: {
    // width: '100%',
  },
})

const ForgotPasswordPanel: React.VFC<{
  onSuccessReset?: (string) => void
  onFailReset?: (any) => void
}> = ({ onSuccessReset = () => {}, onFailReset = () => {} }) => {
  const classes = useStyles()

  const { config } = useContext(AppContext)
  const [email, setEmail] = useState('')
  const { isLoading, error, data, execute } = useResetPassword(config.ndexHttps)

  const handleEmailChange = (evt) => {
    const email: string = evt.target.value
    setEmail(email)
  }

  const handleResetPassword = () => {
    execute(email)
      .then(() => {
        onSuccessReset(email)
      })
      .catch((e) => {
        onFailReset(e)
      })
  }

  return (
    <div className={classes.root}>
      <TextField
        variant="outlined"
        className={classes.textArea}
        error={email.trim().length < 0}
        helperText={
          error
            ? error
            : data
            ? 'Sent a new password to e-mail of record'
            : undefined
        }
        name="id"
        type="text"
        placeholder=""
        required
        label="Account Name or E-Mail"
        autoComplete="username"
        value={email}
        onChange={handleEmailChange}
      />
      <Button
        size={'large'}
        color={'secondary'}
        className={classes.itemRight}
        variant={'outlined'}
        disabled={email.trim().length < 1 || isLoading}
        onClick={handleResetPassword}
      >
        Reset Password
      </Button>
    </div>
  )
}

export default ForgotPasswordPanel
