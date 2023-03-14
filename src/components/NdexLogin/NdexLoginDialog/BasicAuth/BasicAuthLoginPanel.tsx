import { FC, ReactElement, useState, useEffect, useContext } from 'react'
import { Button, FormControl, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import { ErrorOutline } from '@material-ui/icons'
import { validateLogin } from '../../validateCredentials'
import LoadingPanel from '../../LoadingPanel'
import { UserValidation } from '../../UserValidation'
import AppContext from '../../../../context/AppState'
import NdexCredential from '../../../../model/NdexCredential'
import { AuthType } from '../../../../model/AuthType'
import { NdexBasicAuthInfo } from '../../NdexSignInButton/handleNdexSignOn'
import { saveBasicAuth } from './basic-auth-util'

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

const BasicAuthLoginPanel: FC<{
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

  const { setNdexCredential, setShowLogin } = useContext(AppContext)

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
    if (error !== undefined && error['message'] !== undefined) {
      setErrorMessage(error['message'] as string)
    } else {
      setNdexCredential({
        authType: AuthType.BASIC,
        userName: id,
        accesskey: password,
        fullName: userData.firstName + ' ' + userData.lastName,
      } as NdexCredential)

      // Close the login dialog
      setShowLogin(false)

      const loggedInUser: NdexBasicAuthInfo = {
        externalId: userData.externalId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: password,
        id,
      }

      // Write the user info to local storage
      saveBasicAuth(loggedInUser)
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

      {/* <div className={classes.signup}>
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
      </div> */}

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

export default BasicAuthLoginPanel
