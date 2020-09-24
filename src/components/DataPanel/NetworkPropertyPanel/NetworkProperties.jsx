import React from 'react';

import { makeStyles } from '@material-ui/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';

import Linkify from 'linkifyjs/react';
import parse from 'html-react-parser';


const useStyles = makeStyles((theme) => ({
  container: {
    padding: '0.2em',
    backgroundColor: '#FFFFFF',
    overflow: 'auto',
    height: '100%',
    boxSizing: 'content-box',
  },
  padding: {
    paddingLeft: '1em',
    paddingTop: '0.75em',
  },
  lessPadding: {
    paddingTop: '2.49px',
  },
  noPadding: {
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0,
    lineHeight: 1.5,
    wordWrap: 'break-word'
  },
  evenLessPadding: {
    marginBottom: '-2px',
    marginTop: '4px'
  },
  descriptionContainer: {
    paddingTop: '0.5em',
    paddingBottom: '0.75em'
  }
}));

const NetworkProperties = (props) => {
  const {data, description} = props
  const classes = useStyles()

  let index = 0

  const propertiesList = [['Description', formatContent(description)]]
  for (let datum of data) {
    if (datum.value.trim() !== '') {
      propertiesList.push([datum.predicateString, formatContent(datum.value.trim())])
    }
  }

  const display = []
  for (let property of propertiesList) {
    display.push(
      <ListItem key={index++} className={classes.noPadding}>
        <ListItemText className={classes.noPadding} primary = {
          <>
            <Typography variant='caption' color='textSecondary' className={classes.evenLessPadding} component='div'>
              {property[0]}
            </Typography>
            <div>
              <Typography variant='body2'>
                {property[1]}
              </Typography>
            </div>
          </>
        }/>
      </ListItem>
    )
  }

  return (
      <div className={classes.descriptionContainer}>
        <List className={classes.noPadding}>{display}</List>
      </div>
  );
};

const formatContent = (string) => {
  string = string
      .toString()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\ *>/gi, '')
  string = parse(string)
  return <Linkify key={Math.random().toString()}>{string}</Linkify>
}

export default NetworkProperties;
