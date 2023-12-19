/*
 * Copyright 2022 IBM Corp.
 * IBM Confidential Source Code Materials
 * This Source Code is subject to the license and security terms contained in the license/LICENSE file contained in this source code package.
 */
import omit from 'lodash/omit'

export default (props) =>
  omit(props, [
    'addLabel',
    'allowEmpty',
    'basePath',
    'cellClassName',
    'className',
    'defaultExpanded',
    'formClassName',
    'headerClassName',
    'label',
    'link',
    'loaded',
    'locale',
    'record',
    'refetch',
    'resource',
    'sortable',
    'sortBy',
    'source',
    'textAlign',
    'translateChoice',
  ])
