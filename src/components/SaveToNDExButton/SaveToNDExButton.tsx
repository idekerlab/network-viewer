import React, { useContext } from 'react'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip'
import SaveIcon from '@material-ui/icons/Save'
import { NdexAccountContext } from '../../context/NdexAccountContext'
import ndexClient from '@js4cytoscape/ndex-client'

const styles = () => ({
  button: {
    color: '#4DA1DE',
    borderColor: '#4DA1DE',
    '&:active': {
      borderColor: '#4DA1DE',
    },
    'line-height': 0,
  },
  iconSmall: {
    height: '22px',
  },
  iconMedium: {
    height: '24px',
  },
  iconLarge: {
    height: '26px',
  },
  buttonIcon: {
    fontSizeSmall: '22px',
    fontSizeLarge: '26px',
  },
  toolTipSpan: {},
})

const SaveToNDExButton = (props) => {
  const { classes } = props

  const { ndexServerURL, loginInfo } = useContext(NdexAccountContext)

  const { disabled, tooltip, onSuccess, onFailure, variant, fetchCX, size } =
    props

  const onClick = () => {
    const ndex = new ndexClient.NDEx(ndexServerURL + '/v2')
    if (loginInfo) {
      if (loginInfo.isGoogle) {
        ndex.setAuthToken(loginInfo.loginDetails.tokenId)
      } else {
        ndex.setBasicAuth(
          loginInfo.loginDetails.id,
          loginInfo.loginDetails.password,
        )
      }
    }
    fetchCX().then(
      (cx) => {
        ndex
          .createNetworkFromRawCX(cx)
          .then((data) => {
            typeof onSuccess !== 'undefined' && onSuccess(data)
          })
          .catch((error) => {
            typeof onFailure !== 'undefined' && onFailure(error)
          })
      },
      (error) => {
        typeof onFailure !== 'undefined' && onFailure(error)
      },
    )
  }

  const iconClassName = (size) => {
    switch (size) {
      case 'small':
        return classes.iconSmall
      case 'large':
        return classes.iconLarge
      default:
        return classes.iconMedium
    }
  }

  return (
    <React.Fragment>
      <Tooltip disableFocusListener title={tooltip ? tooltip : 'Save to NDEx'}>
        <span>
          <Button //Do not add any spaces between the span and button tags. Tooltip interprets these as an array of elements instead of nested elements and will throw an exception.
            className={classes.button}
            variant={variant}
            onClick={onClick}
            disabled={disabled || !loginInfo}
            size={size}
          >
            <SaveIcon className={iconClassName(size)} />
          </Button>
        </span>
      </Tooltip>
    </React.Fragment>
  )
}

export default withStyles(styles)(SaveToNDExButton)
