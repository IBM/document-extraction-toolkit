import React, { useState, useEffect } from 'react';
import { Layout } from 'react-admin';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Theme, Content } from '@carbon/react';

import CarbonBar from './carbonBar';
import CarbonMenu from './carbonMenu';
import CarbonError from './carbonError';
import PageHeader from './PageHeader';
import style from './index.module.scss';


function CarbonLayout(props) {
	console.log(props)
	const { children } = props;
	const theme = useTheme();

	return(
			<Layout
				{...props}
				appBar={CarbonBar}
				sidebar={CarbonMenu}
				error={CarbonError}
			>
				<Theme theme={theme.carbon}>
					<Content className={style.content}>
					 	<PageHeader />
					 	<div className={style.children}>{children}</div>
					</Content>
				</Theme>
			</Layout>
	)
}

CarbonLayout.propTypes = {
	children: PropTypes.any
}

export default CarbonLayout;