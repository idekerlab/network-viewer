import { useContext } from 'react'
import { IconButton, Tooltip } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save'
import AppContext from '../../context/AppState'
import { getNdexClient } from '../../utils/credentialUtil'
import useCx from '../../hooks/useCx'
import { useParams } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    disabledButtonWrapper: {
      display: 'inline-flex', 
    },
  }),
)

type SaveToNdexButtonProps = {
  disabled: boolean
  subCx?: any[]
  onSuccess?: (data: any) => void
  onFailure?: (err: any) => void
  showLoginTip?: boolean
}

export const SaveToNdexButton = ({
  disabled,
  onSuccess,
  onFailure,
  subCx,
  showLoginTip = false
}: SaveToNdexButtonProps): JSX.Element => {
  const classes = useStyles()

  const { config, ndexCredential } = useContext(AppContext)

  const saveNetwork = async (): Promise<void> => {
    const ndexClient = getNdexClient(`${config.ndexHttps}/v2`, ndexCredential)

    try {
      const res = ndexClient.createNetworkFromRawCX(subCx)
      onSuccess(res)
    } catch (error) {
      typeof onFailure !== 'undefined' && onFailure(error)
    }
  }

  const onClick = (): void => {
    if (subCx !== undefined) {
      try {
        saveNetwork()
          .then((response) => {
            console.log('saveNetwork done', response)
          })
          .catch((error) => {
            typeof onFailure !== 'undefined' && onFailure(error)
          })
      } catch (error) {
        typeof onFailure !== 'undefined' && onFailure(error)
      }
    }
  }
  const tooltipTitle = (showLoginTip)
    ? 'Save query result function is only available to signed-in users'
    : 'Save query result to NDEx';

  return (
    <Tooltip disableFocusListener title={tooltipTitle}>
      <span className={classes.disabledButtonWrapper}> 
        <IconButton
          className={classes.button}
          onClick={onClick}
          disabled={disabled}
        >
          <SaveIcon />
        </IconButton>
      </span>
    </Tooltip>
  )
}
