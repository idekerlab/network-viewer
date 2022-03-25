import red from '@material-ui/core/colors/red'
import blue from '@material-ui/core/colors/blue'
import { createTheme } from '@material-ui/core/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFFFFF',
    },
    secondary: {
      main: blue[800],
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
