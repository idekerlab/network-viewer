import React from 'react'
import Typography from '@material-ui/core/Typography'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import DialogContentText from '@material-ui/core/DialogContentText'
import Button from '@material-ui/core/Button'

interface EmailVerificationPanelProps {
  onVerify: () => void
  onCancel: () => void
  userName: string
  userEmail: string
}

export const EmailVerificationPanel: React.FC<EmailVerificationPanelProps> = ({
  onVerify,
  onCancel,
  userName,
  userEmail,
}) => {
  return (
    <Dialog
      open={true}
      aria-labelledby="email-verification-title"
      aria-describedby="email-verification-description"
    >
      <DialogTitle id="email-verification-title">
        {'Email Verification Required' +
          (userName ? ' for User: ' + userName : '')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="email-verification-description-1">
          {'Please check the email address ' +
            (userEmail ? userEmail : 'associated with your username') +
            ' to verify your account.'}
        </DialogContentText>
        <DialogContentText id="email-verification-description-2">
          Refresh the page once verified. Alternatively, logout and browse NDEx
          as a anonymous user.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onVerify} color="secondary">
          Already Verified
        </Button>
        <Button onClick={onCancel} style={{ color: 'red' }}>
          Log Out
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EmailVerificationPanel
