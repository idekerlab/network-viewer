import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import LogoutIcon from '@material-ui/icons/ExitToApp'
import CloseIcon from '@material-ui/icons/Close'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { ReactElement } from 'react'
import { Button } from '@material-ui/core'
import { KeycloakTokenParsed } from 'keycloak-js'

interface LoginPanelProps {
  token?: KeycloakTokenParsed
  open: boolean
  handleClose: () => void
  handleLogout: () => void
}

export const LoginPanel = (props: LoginPanelProps): ReactElement => {
  const { token, open } = props

  if (!open) {
    return <></>
  }

  return (
    <Card
    // sx={{
    //   zIndex: 1000,
    //   maxWidth: 345,
    //   position: 'fixed',
    //   top: 40,
    //   right: 10,
    // }}
    >
      <CardHeader
        avatar={<Avatar aria-label="user" />}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={token?.name}
        subheader={token?.email}
      />
      <CardContent>
        <Typography variant="body2" color="secondary">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={props.handleLogout}
        >
          Logout
        </Button>
        <Button
          // sx={{ marginLeft: '0.5em' }}
          variant="outlined"
          startIcon={<CloseIcon />}
          onClick={props.handleClose}
        >
          Close
        </Button>
      </CardActions>
    </Card>
  )
}
