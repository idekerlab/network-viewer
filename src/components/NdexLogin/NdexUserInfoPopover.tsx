import React, { FC, ReactElement } from 'react'
import { Avatar, Button, Grid, Typography } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'
import { blue } from '@material-ui/core/colors'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    accountPopover: {
      padding: theme.spacing(2),
    },
    item: {
      padding: 0,
      marginBottom: theme.spacing(1),
    },
    largeAvatar: {
      backgroundColor: blue[500],
      width: theme.spacing(10),
      height: theme.spacing(10),
    },
  })
)

interface NdexUserInfoPopoverProps {
  userId: string
  userImage: string
  userName: string
  onLogout: () => void
  anchorEl: any
  isOpen: boolean
  onClose: () => void
  myAccountURL: string
}

const NdexUserInfoPopover: FC<NdexUserInfoPopoverProps> = (
  props: NdexUserInfoPopoverProps
): ReactElement => {
  const classes = useStyles()

  const {
    userId,
    userImage,
    userName,
    onLogout,
    anchorEl,
    isOpen,
    onClose,
    myAccountURL,
  } = props

  const _handleLogout = (): void => {
    onClose()
    onLogout()
  }

  const getInitial = (userName: string): string => {
    if (userName === undefined || userName === null || userName.length === 0) {
      return '?'
    }

    return userName.substring(0, 1).toUpperCase()
  }

  return (
    <Popover
      id="account-popper"
      classes={{
        paper: classes.accountPopover,
      }}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      anchorEl={anchorEl}
      open={isOpen}
      disableRestoreFocus={true}
    >
      <Grid
        justifyContent={'center'}
        alignItems={'center'}
        container
        direction="column"
      >
        <Grid
          item
          className={classes.item}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Avatar className={classes.largeAvatar} src={userImage}>
            {getInitial(userName)}
          </Avatar>
        </Grid>

        <Grid item className={classes.item}>
          <Typography variant={'h6'}>{userName}</Typography>
        </Grid>

        <Grid item className={classes.item}>
          <Typography variant={'body2'}>
            You are logged in as {userId}
          </Typography>
        </Grid>

        <Grid item direction="row" container spacing={1}>
          <Grid item>
            {myAccountURL && (
              <Button variant={'outlined'} href={myAccountURL} rel="noopener">
                Go to My Account
              </Button>
            )}
          </Grid>
          <Grid item>
            <Button
              variant={'outlined'}
              color={'secondary'}
              onClick={_handleLogout}
            >
              Sign Out
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Popover>
  )
}

export default NdexUserInfoPopover
