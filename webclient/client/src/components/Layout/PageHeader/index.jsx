/*
 * Copyright 2022 IBM Corp.
 * IBM Confidential Source Code Materials
 * This Source Code is subject to the license and security terms contained in the license/LICENSE file contained in this source code package.
 */
/**
 *
 * PageHeader
 *
 */

import React from 'react'
import useBreadcrumbs from 'use-react-router-breadcrumbs'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useTranslate } from 'react-admin'
import styles from './index.module.scss'

import { Breadcrumb, BreadcrumbItem } from '@carbon/react'

function renderResource(breadcrumbs, translate) {
  if(breadcrumbs.length < 2) return;
  let { match, key, breadcrumb } = breadcrumbs[1];
  let pathname = match.pathname;
  pathname = pathname.charAt(0) === '/' ? pathname.substring(1) : pathname;
  let itemname = null;
  if(breadcrumbs.length > 2) {
    key = breadcrumbs[2].key;
    breadcrumb = breadcrumbs[2].breadcrumb;
    itemname = breadcrumb.props.children;
    itemname = itemname.charAt(0) === '/' ? itemname.substring(1) : itemname;
  }
  return <h1 key={key}>{translate(`resources.${pathname}.name`) + ` ${itemname ? '- '+ itemname : ''}`}</h1>
}

function PageHeader() {
  const breadcrumbs = useBreadcrumbs() || []
  console.log('Breadcrumb:', breadcrumbs);
  const translate = useTranslate()
  return (
    <div>
      <Breadcrumb noTrailingSlash>
        {(breadcrumbs || []).map(({ match, breadcrumb, key }) => (
          <BreadcrumbItem key={key}>
            <Link to={match.pathname}>{breadcrumb}</Link>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
      {renderResource(breadcrumbs, translate)}
    </div>
  )
}


export default PageHeader
