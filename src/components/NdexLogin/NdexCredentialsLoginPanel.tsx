import React, { FC, ReactElement, useState, useEffect } from 'react'
import { Button, FormControl, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import { ErrorOutline } from '@material-ui/icons'
import { validateLogin, UserValidation } from './validateCredentials'
import LoadingPanel from './LoadingPanel'

const useStyles = makeStyles({
  root: {
    height: '100%',
    width: '23em',
    padding: '0.3em',
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  loginButton: {
    width: '100%',
    marginTop: '0.5em',
    'background-color': '#337ab7',
    'text-transform': 'none',
  },
  formControl: {
    width: '100%',
  },
  error: {
    paddingLeft: '0.5em',
  },
  errorPanel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '0.5em',
    height: '3em',
  },
  blank: {
    marginTop: '0.5em',
    width: '100%',
  },
  userInfo: {
    width: '100%',
  },
  signup: {
    height: '100%',
    display: 'grid',
    justifyContent: 'left',
    alignItems: 'center',
    flexGrow: 1,
  },
})

const FIELD_NAME = {
  ID: 'id',
  PW: 'password',
}

const NdexCredentialsLoginPanel: FC<{
  onSuccessLogin: Function
  handleNDExSignOn: Function
  ndexServer: string
  setContentMode: (mode: string) => void
}> = ({
  onSuccessLogin,
  handleNDExSignOn,
  ndexServer,
  setContentMode,
}): ReactElement => {
  const classes = useStyles()

  const [isLoading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (id === '' || password === '') {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [id, password])

  const handleSubmit = async (event) => {
    event.preventDefault()

    setLoading(true)
    setErrorMessage(null)

    const data: UserValidation = await validateLogin(id, password, ndexServer)

    setLoading(false)

    const { error, userData } = data
    if (error !== null && error['message'] !== undefined) {
      setErrorMessage(error['message'] as string)
    } else {
      handleNDExSignOn(
        {
          id,
          password,
          ndexServer,
          fullName: userData.firstName + ' ' + userData.lastName,
          image: userData.image,
          details: userData,
        },
        onSuccessLogin
      )
    }
    
  }

  const handleChange = (tag: string) => (event) => {
    const value = event.target.value
    if (tag === FIELD_NAME.ID) {
      setId(value)
    } else if (tag === FIELD_NAME.PW) {
      setPassword(value)
    }

    if (id !== '' && password !== '') {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }

  if (isLoading) {
    return <LoadingPanel message={'Validating your user info...'} />
  }

  return (
    <form onSubmit={handleSubmit} className={classes.root}>
      <div className={classes.userInfo}>
        <FormControl className={classes.formControl}>
          <TextField
            name="id"
            type="text"
            placeholder="Your NDEx ID"
            required
            title=""
            autoComplete="username"
            onChange={handleChange('id')}
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            name="password"
            type="password"
            placeholder="Password"
            required
            title=""
            autoComplete="password"
            onChange={handleChange('password')}
          />
        </FormControl>

        <Button
          className={classes.loginButton}
          type="submit"
          variant="contained"
          color={'secondary'}
          disabled={disabled}
        >
          Sign In with NDEx
        </Button>
      </div>

      <div className={classes.signup}>
        <Typography variant={'body1'}>
          <a
            href="#"
            onClick={() => {
              setContentMode('FORGOT_PASSWORD')
            }}
          >
            Forgot your password?
          </a>
        </Typography>

        <Typography variant={'body2'}>
          {'Need an account? '}
          <a
            href="#"
            onClick={() => {
              setContentMode('SIGN_UP')
            }}
          >
            Click here to sign up!
          </a>
        </Typography>
      </div>

      {errorMessage ? (
        <div className={classes.errorPanel}>
          <ErrorOutline color={'error'} />
          <Typography
            className={classes.error}
            variant={'body1'}
            color={'error'}
          >
            {errorMessage}
          </Typography>
        </div>
      ) : (
        <div className={classes.blank} />
      )}
    </form>
  )
}

export default NdexCredentialsLoginPanel
