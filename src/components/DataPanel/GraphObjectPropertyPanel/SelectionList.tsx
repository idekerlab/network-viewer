import React, { useContext } from 'react'
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles'

import ListSubheader from '@material-ui/core/ListSubheader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import DraftsIcon from '@material-ui/icons/Drafts'
import SendIcon from '@material-ui/icons/Send'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import StarBorder from '@material-ui/icons/StarBorder'

import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'

import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import useSearch from '../../../hooks/useSearch'
import AppContext from '../../../context/AppState'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      overflowY: 'scroll',
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    nodes: {
      backgroundColor: theme.palette.secondary.main,
    },
    edges: {
      backgroundColor: theme.palette.secondary.main,
    },
    card: {
      padding: '0.5em',
    },
    table: {},
  }),
)

const dummyData = {
  id: '55038',
  name: 'CDCA4',
  fullName: 'Cell Division Cycle Associated 4',
  alias: [
    'Cell Division Cycle Associated',
    'Hematopoietic Progenitor Protein',
    'Cell Division Cycle-Associated Protein',
    'HEPP',
    'SEI-3/HEPP',
  ],
  summary:
    'This gene encodes a protein that belongs to the E2F family of transcription' +
    ' factors. This protein regulates E2F-dependent transcriptional activation and cell ' +
    'proliferation, mainly through the E2F/retinoblastoma protein pathway. It also functions' +
    ' in the regulation of JUN oncogene expression. This protein shows distinctive ' +
    'nuclear-mitotic apparatus distribution, it is involved in spindle organization from ' +
    'prometaphase, and may also play a role as a midzone factor involved in chromosome ' +
    'segregation or cytokinesis. Two alternatively spliced transcript variants encoding ' +
    'the same protein have been noted for this gene. Two pseudogenes have also been identified' +
    ' on chromosome 1. [provided by RefSeq, May 2014]',
  location: 'https://cdn.genecards.org/genomic-location-v4-14/CDCA4-gene.png',
  locationDetail:
    'CDCA4 Gene in genomic location: bands according to Ensembl, locations according to GeneLoc (and/or Entrez Gene and/or Ensembl if different)',
}

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 12,
    },
  }),
)(TableCell)
const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow)

const SelectionList = (props) => {
  const classes = useStyles()
  const { network, selected} = props

  const appContext = useContext(AppContext)
  const {uuid, query, setSelectedEdges, setSelectedNodes} = appContext

  const [open, setOpen] = React.useState(true)

  const { status, data, error, isFetching } = useSearch(uuid, query, '')
 console.log('#########data raw', data) 

  const handleClick = () => {
    setOpen(!open)
  }

  let nodes = []
  let edges = []

  if (data !== undefined) {
    nodes = data
  }
 console.log('#########data', nodes) 
  return (
    <List
      dense
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Selected Nodes and Edges
        </ListSubheader>
      }
      className={classes.root}
    >
      <ListItem dense button onClick={handleClick}>
        <ListItemAvatar>
          <Avatar className={classes.nodes} alt="Nodes">
            N
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Nodes" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {nodes.map((n) => {
            return (
              <ListItem dense className={classes.nested} key={n}>
                <ListItemText primary={n} secondary={n} />
              </ListItem>
            )
          })}
        </List>
      </Collapse>
      <ListItem button onClick={handleClick}>
        <ListItemAvatar>
          <Avatar className={classes.edges} alt="Edges">
            E
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Edges" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {edges.map((e) => {
            const data = e['data']
            return (
              <ListItem dense className={classes.nested} key={data['id']}>
                <ListItemText primary={data['name']} secondary={data['id']} />
              </ListItem>
            )
          })}
        </List>
      </Collapse>
    </List>
  )
}

export default SelectionList
