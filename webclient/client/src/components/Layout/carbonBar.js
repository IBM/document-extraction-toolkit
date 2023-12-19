import React, { useState, useEffect, Fragment } from 'react';
import { LoadingIndicator, useTranslate, useSidebarState } from 'react-admin';
import AppBar from '@mui/material/AppBar';
import { NavLink } from 'react-router-dom';
import {
	Translate
} from '@carbon/icons-react';
import Carbon from '../../themes/carbon';
import Carbon90 from '../../themes/carbon-g90';
import { useLocaleState, useLocales, useI18nProvider } from 'ra-core';
import { useTheme } from '@mui/material/styles'
import {
	Header,
	SkipToContent,
	HeaderMenuButton,
	HeaderName,
	HeaderGlobalBar,
	HeaderGlobalAction,
	HeaderPanel,
	Switcher,
	SwitcherItem,
	SwitcherDivider,
	Theme
} from '@carbon/react';
import { ToggleThemeButton } from '../carbon-ra';


const CarbonBar = (props) => {

	const [open, setOpen] = useSidebarState();
	const [isRightPanelExpanded, setIsRightPanelExpanded] = useState(false);
	const languages = useLocales()
  	const [locale, setLocale] = useLocaleState()
  	const translate = useTranslate();
  	let uiVersion = 'Alpha';
	const handleOnToggle = () => {
    	setOpen((open) => !open)
  	};

  	const handleRightPanelOnToggle = () => {
    	setIsRightPanelExpanded((isRightPanelExpanded) => !isRightPanelExpanded)
  	};

  	const changeLocale = (locale) => () => {
    	setLocale(locale)
  	}
  	const theme=useTheme();

	return (
		<AppBar
			{...props}
			color="default"
			enableColorOnDark={true}
			position="sticky"
		>
			<Theme theme={theme.carbon}>
				<Header aria-label="IBM Document Extraction Toolkit">
		          <SkipToContent />
		          <HeaderMenuButton aria-label="Open menu" onClick={handleOnToggle} isActive={open} isCollapsible />
		          <HeaderName element={NavLink} to="/" prefix="IBM">
		            {translate('menu.header')} - {uiVersion}
		          </HeaderName>
		          <HeaderGlobalBar>
		            <LoadingIndicator classes={{ loadedIcon: 'loading-indicator' }} aria-label="Refresh Data" />
		            <HeaderGlobalAction
		              aria-label="Localization"
		              isActive={isRightPanelExpanded}
		              onClick={handleRightPanelOnToggle}
		              tooltipAlignment="end"
		            >
		              <Translate size={20} />
		            </HeaderGlobalAction>
		            <ToggleThemeButton darkTheme={Carbon90} lightTheme={Carbon} />
		          </HeaderGlobalBar>
		          <HeaderPanel aria-label="Header Panel" expanded={isRightPanelExpanded}>
		            <Switcher aria-label="Switcher Container">
		              <SwitcherItem aria-label="Available Languages">Available Languages</SwitcherItem>
		              <SwitcherDivider />
		              {languages.map((language) => (
		                <SwitcherItem
		                  aria-label={language.name}
		                  key={language.locale}
		                  onClick={changeLocale(language.locale)}
		                  selected={language.locale === locale}
		                >
		                  {language.name}
		                </SwitcherItem>
		              ))}
		            </Switcher>
		          </HeaderPanel>
		        </Header>
		    </Theme>
        </AppBar>
	)
}

export default CarbonBar;
