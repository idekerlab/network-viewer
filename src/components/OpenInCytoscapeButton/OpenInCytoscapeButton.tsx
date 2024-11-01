import React, { useState, useContext } from 'react'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import logo from './assets/images/cytoscape-logo.svg'
import logoDisabled from './assets/images/cytoscape-logo-mono-light.svg'
import { withStyles } from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip'
import { CyNDEx } from '@js4cytoscape/ndex-client'
import LargeNetworkDialog from './LargeNetworkDialog'
import AppContext from '../../context/AppState'
import { AuthType } from '../../model/AuthType'
import { useCyNdexValue } from './CyNdexContext'

const styles = () => ({
  button: {
    color: '#EA9123',
    borderColor: '#EA9123',
    '&:active': {
      borderColor: '#EA9123',
    },
    'line-height': 0,
  },
  iconSmall: {
    height: '22px',
    'margin-left': '2px',
  },
  iconMedium: {
    height: '24px',
  },
  iconLarge: {
    height: '26px',
  },
  buttonIcon: {
    height: '100%',
    width: '100%',
  },
})

/**
 * Button to open network data in Cytoscape Desktop
 *
 * @param props
 * @returns
 */
const OpenInCytoscapeButton = (props) => {
  const cyNDExValue = useCyNdexValue()
  const cyRESTAvailable = cyNDExValue.state.available
  const cyNDExStatus = cyNDExValue.state.status
  const cyRESTPort = cyNDExValue.state.port

  const { config, ndexCredential } = useContext(AppContext)
  const { ndexHttps } = config
  const [largeNetworkDialogOpen, setLargeNetworkDialogOpen] = useState(false)

  const importNetworkFromNDEx = (createView) => {
    const cyndex = new CyNDEx(cyRESTPort)

    cyndex.setNDExServer(ndexHttps)

    if (
      ndexCredential.accesskey !== undefined &&
      ndexCredential.authenticated
    ) {
      cyndex.setAuthToken(ndexCredential.accesskey)
    }

    const accessKey = ndexNetworkProperties.accessKey

    cyndex
      .postNDExNetworkToCytoscape(
        ndexNetworkProperties.uuid,
        accessKey,
        createView,
      )
      .then((response) => {
        typeof onSuccess !== 'undefined' && onSuccess(response.data)
      })
      .catch((error) => {
        typeof onFailure !== 'undefined' && onFailure(error)
      })
  }

  const getObjectCount = (ndexNetworkProperties) => {
    if (!ndexNetworkProperties.summary) {
      return undefined
    }

    return (
      (ndexNetworkProperties.summary.edgeCount
        ? ndexNetworkProperties.summary.edgeCount
        : 0) +
      (ndexNetworkProperties.summary.nodeCount
        ? ndexNetworkProperties.summary.nodeCount
        : 0)
    )
  }

  /**
   * Compares decimal separated version strings.
   * Returns:
   *    1 if a > b
   *    0 if a = b
   *   -1 if a < b
   *
   * @param {*} a
   * @param {*} b
   * @returns
   */
  const checkVersion = (a: string, b: string) => {
    let x = a.split('.').map((e) => parseInt(e))
    let y = b.split('.').map((e) => parseInt(e))
    let z = ''
    let i = 0
    for (i = 0; i < x.length; i++) {
      if (x[i] === y[i]) {
        z += 'e'
      } else if (x[i] > y[i]) {
        z += 'm'
      } else {
        z += 'l'
      }
    }
    if (!z.match(/[l|m]/g)) {
      return 0
    } else if (z.split('e').join('')[0] === 'm') {
      return 1
    } else {
      return -1
    }
  }

  const cyndexHasExplicitViewSupport = () => {
    const oldestVersion = '3.4.0'

    const checkVersionResult = checkVersion(
      cyNDExStatus.appVersion,
      oldestVersion,
    )
    return checkVersionResult >= 0
  }

  const importNetwork = () => {
    if (ndexNetworkProperties) {
      const objectCount = getObjectCount(ndexNetworkProperties)

      if (!objectCount || !cyndexHasExplicitViewSupport()) {
        importNetworkFromNDEx(undefined)
      } else if (objectCount > 100000) {
        setLargeNetworkDialogOpen(true)
      } else {
        importNetworkFromNDEx(true)
      }
    } else {
      const cyndex = new CyNDEx(cyRESTPort)
      fetchCX().then(
        (cx) => {
          cyndex
            .postCXNetworkToCytoscape(cx)
            .then((response) => {
              typeof onSuccess !== 'undefined' && onSuccess(response.data)
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
  }

  const {
    classes,
    variant,
    size,
    onSuccess,
    onFailure,
    fetchCX,
    ndexNetworkProperties,
  } = props

  const getMetaDataElement = (metaData, aspectName) => {
    return metaData.find((element) => element && element['name'] === aspectName)
  }

  const hasLayout =
    ndexNetworkProperties && ndexNetworkProperties.summary
      ? ndexNetworkProperties.summary.hasLayout
      : false
  const hasView =
    ndexNetworkProperties && ndexNetworkProperties.metaData
      ? getMetaDataElement(ndexNetworkProperties.metaData, 'cyVisualProperties')
        ? true
        : false
      : false

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
      <Tooltip
        disableFocusListener
        title={
          cyRESTAvailable
            ? 'Open this network in Cytoscape'
            : 'To use this feature, you need Cytoscape 3.6.0 or higher running on your machine (default port: 1234) and the CyNDEx-2 app installed'
        }
        placement="bottom"
      >
        <span>
          <Button //Do not add any spaces between the span and button tags. Tooltip interprets these as an array of elements instead of nested elements and will throw an exception.
            className={classes.button}
            variant={variant}
            disabled={!cyRESTAvailable}
            onClick={importNetwork}
            size={size}
          >
            Open In Cytoscape
            <Icon className={iconClassName(size)}>
              <img
                alt="Open in Cytoscape"
                className={classes.buttonIcon}
                src={!cyRESTAvailable ? logoDisabled : logo}
              />
            </Icon>
          </Button>
        </span>
      </Tooltip>
      <LargeNetworkDialog
        isOpen={largeNetworkDialogOpen}
        setIsOpen={setLargeNetworkDialogOpen}
        importNetworkFunction={importNetworkFromNDEx}
        hasLayout={hasLayout}
        hasView={hasView}
      />
    </React.Fragment>
  )
}

export default withStyles(styles)(OpenInCytoscapeButton)
