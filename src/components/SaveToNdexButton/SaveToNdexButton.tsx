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
  }),
)

type SaveToNdexButtonProps = {
  disabled: boolean
  subCx?: any[]
  onSuccess?: (data: any) => void
  onFailure?: (err: any) => void
}

export const SaveToNdexButton = ({
  disabled,
  onSuccess,
  onFailure,
  subCx,
}: SaveToNdexButtonProps): JSX.Element => {
  const classes = useStyles()

  const { config, ndexCredential } = useContext(AppContext)
  const { uuid } = useParams()
  // const { data } = useCx(
  //   uuid,
  //   config.ndexHttps,
  //   'v2',
  //   ndexCredential,
  //   config.maxNumObjects,
  // )

  const saveNetwork = async (cx: any[]): Promise<void> => {
    const ndexClient = getNdexClient(`${config.ndexHttps}/v2`, ndexCredential)

    const res = ndexClient.createNetworkFromRawCX(subCx)
    onSuccess(res)
    // .catch((error) => {
    //   typeof onFailure !== 'undefined' && onFailure(error)
    // })
  }
  const onClick = (): void => {
    if (subCx !== undefined) {
      try {
        saveNetwork(subCx)
          .then((response) => {
            console.log('saveNetwork done', response)
          })
          .catch((error) => {
            typeof onFailure !== 'undefined' && onFailure(error)
          })
      } catch (error) {}
    }
  }

  return (
    <Tooltip disableFocusListener title={'Save to NDEx'}>
      <IconButton
        className={classes.button}
        onClick={onClick}
        disabled={disabled}
      >
        <SaveIcon />
      </IconButton>
    </Tooltip>
  )
}
