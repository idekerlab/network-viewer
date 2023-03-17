import React, { useState, useContext } from 'react'
import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { isValidEmail, useCreateUser } from '../../../../api/ndex'
import { validateLogin } from '../../validateCredentials'
import AppContext from '../../../../context/AppState'
import { AuthType } from '../../../../model/AuthType'

const useStyles = makeStyles({
  signUpHeader: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1.2em',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    alignSelf: 'normal',
    marginRight: '1em',
    marginLeft: '1em',
  },
  leftItem: {
    paddingRight: '1em',
  },
  rightItem: {
    paddingRight: '0em',
  },
  lastItem: {
    alignSelf: 'flex-end',
  },
  textItem: {
    paddingBottom: '1em',
  },
})

type NdexUserInfo = {
  userName: string
  firstName: string
  lastName: string
  emailAddress: string
  password: string
}

const NdexSignUpPanel = (props) => {
  const classes = useStyles()

  const { onSuccessLogin, onWaitForEmailValidation } = props

  const { config, setNdexCredential, setShowLogin } = useContext(AppContext)
  const ndexServerURL = config.ndexHttps

  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [emailAddress, setEmailAddress] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [readAgreement, setReadAgreement] = useState(false)

  const [errorMessage, setErrorMessage] = useState<string>()

  const [showEmailValidation, setShowEmailValidation] = useState(false)

  const { isLoading, error, data, execute } = useCreateUser(ndexServerURL)

  const loginAfterCreate = (userName: string, password: string) => {
    setErrorMessage(undefined)

    validateLogin(userName, password, ndexServerURL).then((data) => {
      setTimeout(() => {
        if (data.error !== null && data.error !== undefined) {
          setErrorMessage(data.error.message)
        } else {
          console.log('success login after create')

          setNdexCredential({
            userName: data.userData.userName,
            fullName: data.userData.firstName + ' ' + data.userData.lastName,
            authType: AuthType.BASIC,
            accesskey: password,
          })
          setShowLogin(false)
          // handleNDExSignOn(
          //   {
          //     id: data.userData.userName,
          //     password,
          //     ndexServer: ndexServerURL,
          //     fullName: data.userData.firstName + ' ' + data.userData.lastName,
          //     image: data.userData.image,
          //     details: data.userData,
          //   },
          //   onSuccessLogin,
          // )
        }
      }, 500)
    })
  }

  const validate = (): string | null => {
    if (
      firstName.length < 1 ||
      lastName.length < 1 ||
      userName.length < 1 ||
      emailAddress.length < 1 ||
      password.length < 1 ||
      confirmPassword.length < 1
    ) {
      return 'Please fill out all fields.'
    }

    if (!isValidEmail(emailAddress)) {
      return 'Please enter a valid email.'
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match'
    }

    if (password.length < 8) {
      return 'Password must be a minimum of 8 characters'
    }

    if (!readAgreement) {
      return 'Please read and sign the Terms & Conditions'
    }
    return null
  }

  const handleChange = (event) => {
    switch (event.target.name) {
      case 'firstName':
        setFirstName(event.target.value)
        break
      case 'lastName':
        setLastName(event.target.value)
        break
      case 'userName':
        setUserName(event.target.value)
        break
      case 'emailAddress':
        setEmailAddress(event.target.value)
        break
      case 'password':
        setPassword(event.target.value)
        break
      case 'confirmPassword':
        setConfirmPassword(event.target.value)
        break
      case 'readAgreement':
        setReadAgreement(event.target.checked)
        break
    }
  }

  const signUpAction = (event) => {
    event.preventDefault()
    const formError = validate()
    if (formError === null) {
      const user: NdexUserInfo = {
        userName,
        firstName,
        lastName,
        emailAddress,
        password,
      }
      execute(user)
        .then((response) => {
          if (response.parsedBody && response.parsedBody.length > 0) {
            loginAfterCreate(user.userName, user.password)
          } else {
            setShowEmailValidation(true)
            onWaitForEmailValidation()
          }
        })
        .catch((error) => {
          setErrorMessage('Cannot create user: ' + error)
        })
    } else {
      setErrorMessage(formError)
    }
  }

  return showEmailValidation ? (
    <div className={classes.signUpHeader}>
      <div className={classes.item}>
        <Typography variant={'h6'} className={classes.textItem}>
          Check Your Email
        </Typography>
        <Typography variant={'subtitle2'} className={classes.textItem}>
          ALMOST DONE!
        </Typography>
        <Typography variant={'body1'} className={classes.textItem}>
          We sent a verification link to the e-mail address you provided. Please
          check your email and follow the instructions to complete your
          registration. You must complete your registration within 24 hours.
          Can't find the email? Make sure to check your SPAM folder and add
          "support@ndexbio.org" to your safe-senders list.
        </Typography>
      </div>
    </div>
  ) : (
    <form onSubmit={signUpAction}>
      <div className={classes.signUpHeader}>
        <div className={classes.item}>
          <TextField
            name="firstName"
            label="First Name"
            value={firstName}
            onChange={handleChange}
            className={classes.leftItem}
          />
          <TextField
            name="lastName"
            label="Last Name"
            value={lastName}
            onChange={handleChange}
            className={classes.rightItem}
          />
        </div>
        <TextField
          name="userName"
          label="Username"
          value={userName}
          onChange={handleChange}
          className={classes.item}
        />
        <TextField
          name="emailAddress"
          label="E-Mail Address"
          value={emailAddress}
          onChange={handleChange}
          className={classes.item}
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          value={password}
          onChange={handleChange}
          autoComplete="current-password"
          className={classes.item}
        />
        <TextField
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={handleChange}
          autoComplete="current-password"
          className={classes.item}
        />

        <FormControlLabel
          className={classes.item}
          control={
            <Checkbox
              checked={readAgreement}
              onChange={handleChange}
              name="readAgreement"
              color="secondary"
            />
          }
          label={
            <Typography variant={'body1'}>
              I have read and accept the{' '}
              <a
                href="https://home.ndexbio.org/disclaimer-license/"
                target="_blank"
                rel="noreferrer"
              >
                Terms &amp; Conditions
              </a>
            </Typography>
          }
        />
        {errorMessage ||
          (error && (
            <Typography>{errorMessage ? errorMessage : error}</Typography>
          ))}
        <Button
          color={'secondary'}
          variant={'outlined'}
          className={classes.lastItem}
          disabled={isLoading}
          type="submit"
        >
          Sign Up
        </Button>
      </div>
    </form>
  )
}

export default NdexSignUpPanel
