import React, { useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Tooltip,
  IconButton,
} from '@material-ui/core'

import InfoIcon from '@material-ui/icons/InfoOutlined'

import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
  root: {
    padding: 0,
    margin: 0,
  },
  content: {
    padding: '2em',
    margin: 0,
  },
  title: {
    color: '#444444',
    'padding-top': '0.8em',
    'padding-bottom': '0em',
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  ndexLogo: {
    height: '3em',
    marginRight: '1em',
  },
  actionPanel: {
    margin: 0,
    padding: '0.3em',
  },
  userIcon: {
    height: '1.5em',
    width: '1.5em',
  },
  formLabel: {
    'padding-top': '1em',
    'padding-left': '1em',
  },
})

const LargeNetworkDialog = (props) => {
  const classes = useStyles()

  const { isOpen, hasLayout, hasView, setIsOpen, importNetworkFunction } = props

  const [viewBehavior, setViewBehavior] = useState('none')

  const createViewTip =
    hasView || hasLayout ? (
      <Typography>
        Choose this option to import the network and display it{' '}
        <u>preserving the original layout and visual styling info</u>. Your
        computer might crash if it's older or not powerful enough.
      </Typography>
    ) : (
      <Typography>
        Choose this option to import the network and display it{' '}
        <u>generating any necessary layout or visual styling info</u>. Your
        computer might crash if it's older or not powerful enough.
      </Typography>
    )
  const dontCreateViewTip =
    hasView || hasLayout ? (
      <Typography>
        Choose this option to import the network without generating a graphic
        rendering. The{' '}
        <u>original layout and visual styling info will be lost</u>. You can
        decide to generate a graphic rendering later if desired.
      </Typography>
    ) : (
      <Typography>
        Choose this option to import the network without generating a graphic
        rendering. You can decide to generate a graphic rendering later if
        desired.
      </Typography>
    )

  const createViewLabel =
    hasView || hasLayout ? (
      <Typography display="inline">
        <b>Create View</b> (Resource Intensive, layout and visual properties are
        preserved)
      </Typography>
    ) : (
      <Typography display="inline">
        <b>Create View</b> (Resource Intensive)
      </Typography>
    )

  const dontCreateViewLabel =
    hasView || hasLayout ? (
      <Typography display="inline">
        <b>Don't Create View</b> (Faster, layout and visual properties are
        discarded)
      </Typography>
    ) : (
      <Typography display="inline">
        <b>Don't Create View</b> (Faster)
      </Typography>
    )

  const handleChange = (event) => {
    setViewBehavior(event.target.value)
  }

  return (
    <Dialog className={classes.root} open={isOpen}>
      <DialogTitle disableTypography={true} className={classes.title}>
        <Typography variant={'h6'}>Open Large Network in Cytoscape</Typography>
      </DialogTitle>

      <DialogContent className={classes.content}>
        <Typography>
          You are about to import a large network. Creating a view for a network
          of this size requires large amounts of memory and could cause problems
          on less powerful computers. Please choose one of the following
          options.
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="viewBehavior"
            name="viewBehavior1"
            value={viewBehavior}
            onChange={handleChange}
          >
            <FormControlLabel
              className={classes.formLabel}
              value="createView"
              control={<Radio />}
              label={
                <div>
                  {createViewLabel}
                  <Tooltip title={createViewTip}>
                    <IconButton size={'small'} disableFocusRipple disableRipple>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              }
            />
            <FormControlLabel
              className={classes.formLabel}
              value="dontCreateView"
              control={<Radio />}
              label={
                <div>
                  {dontCreateViewLabel}
                  <Tooltip title={dontCreateViewTip}>
                    <IconButton size={'small'} disableFocusRipple disableRipple>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              }
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <Divider />
      <DialogActions className={classes.actionPanel}>
        <Button
          variant={'contained'}
          disabled={viewBehavior === 'none'}
          onClick={() => {
            setIsOpen(false)
            importNetworkFunction(viewBehavior === 'createView')
            setViewBehavior('none')
          }}
          color={'default'}
        >
          Import
        </Button>
        <Button
          variant={'contained'}
          onClick={() => {
            setIsOpen(false)
            setViewBehavior('none')
          }}
          color={'default'}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LargeNetworkDialog
