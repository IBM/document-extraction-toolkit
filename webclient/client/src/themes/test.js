import { defaultTheme } from 'react-admin'
import indigo from '@mui/material/colors/indigo'
import pink from '@mui/material/colors/pink'
import red from '@mui/material/colors/red'

const myTheme = {
  ...defaultTheme,
  palette: {
    primary: indigo,
    secondary: pink,
    error: red,
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Arial', 'sans-serif'].join(','),
  },
}

export default myTheme
