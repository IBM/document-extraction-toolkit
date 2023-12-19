import React, { useState } from 'react'
import { Tooltip, IconButton } from '@mui/material'
import { Awake, Moon } from '@carbon/icons-react'
import { useTranslate } from 'ra-core'
import { useTheme } from 'react-admin'
import { RaThemeOptions } from '..'

/**
 * Button toggling the theme (light or dark).
 *
 * @example
 *
 * const MyAppBar = props => (
 *     <AppBar {...props}>
 *         <Box flex="1">
 *             <Typography variant="h6" id="react-admin-title"></Typography>
 *         </Box>
 *         <ToggleThemeButton lightTheme={lightTheme} darkTheme={darkTheme} />
 *     </AppBar>
 * );
 *
 * const MyLayout = props => <Layout {...props} appBar={MyAppBar} />;
 */
const ToggleThemeButton = (props) => {
  const translate = useTranslate()
  const [currentTheme, setCurrentTheme] = useState('dark')
  const { darkTheme, lightTheme } = props
  const [theme, setTheme] = useTheme(lightTheme)

  const handleTogglePaletteType = () => {
    setTheme(currentTheme === 'dark' ? lightTheme : darkTheme)
    setCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark')
  }
  const toggleThemeTitle = translate('ra.action.toggle_theme', {
    _: 'Toggle Theme',
  })

  return (
    <Tooltip title={toggleThemeTitle} enterDelay={300}>
      <IconButton color="inherit" onClick={handleTogglePaletteType} aria-label={toggleThemeTitle}>
        {currentTheme === 'dark' ? <Awake /> : <Moon />}
      </IconButton>
    </Tooltip>
  )
}

export default ToggleThemeButton
