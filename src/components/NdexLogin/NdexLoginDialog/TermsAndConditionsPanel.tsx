import React, { useContext, useState } from 'react'
import {
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { NdexAccountContext } from '../../../context/NdexAccountContext'
import { useCreateGoogleUser } from '../../../api/ndex'
import AppContext from '../../../context/AppState'

const useStyles = makeStyles({
  signInHeader: {
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
    marginTop: '1em',
  },
  lastItem: {
    alignSelf: 'flex-end',
  },
})

const TermsAndConditionsPanel = (props) => {
  const { oauth, onGoogleAgreement } = props

  const classes = useStyles()

  const { config } = useContext(AppContext)
  const { ndexUrl } = config

  const [errorMessage, setErrorMessage] = useState<string>()

  const {
    isLoading,
    error,
    //data,
    execute,
  } = useCreateGoogleUser(ndexUrl)

  const [readAgreement, setReadAgreement] = useState(false)

  const handleChange = (event) => {
    console.log('set agreement to checked')
    setReadAgreement(event.target.checked)
  }

  const agreeAction = (event) => {
    console.log('agreeAction', event)
    setErrorMessage(undefined)
    console.log('agreeaction tokenId=', oauth.tokenId)
    console.log('agreeaction email=', oauth.profileObj.email)
    execute(oauth.tokenId, oauth.profileObj.email)
      .then(() => {
        onGoogleAgreement(oauth)
      })
      .catch((error) => {
        console.log(error)
        setErrorMessage('Cannot create user account.')
      })
  }

  return (
    <div className={classes.signInHeader}>
      <Typography className={classes.item}>
        No account was found in NDEx for the selected email address, so we are
        creating one for you.
      </Typography>
      <Typography className={classes.item}>
        Please review and accept our Terms and Conditions and then click the
        'Sign Up' button to complete your registration.
      </Typography>
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
        onClick={agreeAction}
        disabled={!readAgreement || isLoading}
        className={classes.lastItem}
      >
        Sign Up
      </Button>
    </div>
  )
}

export default TermsAndConditionsPanel
