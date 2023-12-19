import React, { useState, useEffect } from 'react';
import { Menu, useTranslate, useSidebarState } from 'react-admin';
import {
	SideNav,
	SideNavMenu,
	SideNavMenuItem,
	SideNavItems,
	SideNavFooter,
	Theme
} from '@carbon/react';

import { NavLink } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';


import menuList from 'components/Admin/menuList'


function CarbonMenu(props) {
	console.log(props)
	const [open, setOpen] = useSidebarState();

  	const translate = useTranslate();
  	const theme = useTheme()

  	const handleOnToggle = () => {
    	setOpen((open) => !open)
  	};

  	const enableFooter = useMediaQuery(theme.breakpoints.up('lg'))

	return(
		<Menu>
			<Theme theme={theme.carbon} >
				<SideNav aria-label="Side navigation"  expanded={open} isRail>
		          <SideNavItems>
		          	{
		          		menuList.Menu.map((menuEl) => (
		          			<SideNavMenu key={menuEl.title.replace(/\s/g,'-')} renderIcon={menuEl.icon} title={translate(menuEl.titleTranslate)}>
		          				{
		          					menuEl.menuItem.map((menuItem) => (
		          						<SideNavMenuItem key={menuItem.title.replace(/\s/g,'-')} element={NavLink} to={menuItem.link}>
		          							{translate(menuItem.titleTranslate)}
		          						</SideNavMenuItem>
		          					))
		          				}
		          			</SideNavMenu>
		          		))
		          	}
		          	</SideNavItems>
		          <SideNavFooter
		            expanded={enableFooter}
		            onToggle={handleOnToggle}
		          />
	        	</SideNav>
	        </Theme>
		</Menu>
	)
}



export default CarbonMenu;