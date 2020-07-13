import red from '@material-ui/core/colors/red'
import blue from '@material-ui/core/colors/blue'
import { createMuiTheme } from '@material-ui/core/styles'

// TODO: need to be customized in the final version
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#FFFFFF',
      // main: '#556cd6',
    },
    secondary: {
      main: blue[800]
    },
    error: {
      main: red.A200,
    },
    background: {
      default: '#EFEFEF',
    },
  },
})

export default theme
