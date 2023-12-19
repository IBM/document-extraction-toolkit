import * as React from 'react'
import { cloneElement, useMemo, useContext } from 'react'
import PropTypes from 'prop-types'
import { sanitizeListRestProps, useListContext, useResourceContext, useResourceDefinition } from 'ra-core'

import { TopToolbar, CreateButton, ExportButton, FilterContext, FilterButton } from 'react-admin'
import { DocumentAdd, DocumentExport, Filter, Upload, DocumentImport } from '@carbon/icons-react'
import ListActionButton from '../ListActionButton'

/**
 * Action Toolbar for the List view
 *
 * Internal component. If you want to add or remove actions for a List view,
 * write your own ListActions Component. Then, in the <List> component,
 * use it in the `actions` prop to pass a custom component.
 *
 * @example
 *     import { cloneElement } from 'react';
 *     import Button from '@mui/material/Button';
 *     import { TopToolbar, List, CreateButton, ExportButton } from 'react-admin';
 *
 *     const PostListActions = ({ filters }) => (
 *         <TopToolbar>
 *             { cloneElement(filters, { context: 'button' }) }
 *             <CreateButton/>
 *             <ExportButton/>
 *             // Add your custom actions here //
 *             <Button onClick={customAction}>Custom Action</Button>
 *         </TopToolbar>
 *     );
 *
 *     export const PostList = (props) => (
 *         <List actions={<PostListActions />} {...props}>
 *             ...
 *         </List>
 *     );
 */
const ListActions = (props) => {
  const {
    className,
    filters: filtersProp,
    hasCreate: hasCreateProp,
    hasUpload: hasUploadProp,
    hasImport: hasImportPorp,
    uploadLink: uploadLinkProp,
    uploadLabel = 'ra_custom.action.upload',
    importLink: importLinkProp,
    importLabel = 'ra_custom.action.import',
    ...rest
  } = props
  const { sort, displayedFilters, filterValues, exporter, showFilter, total } = useListContext(props)
  const resource = useResourceContext(props)
  const { hasCreate } = useResourceDefinition(props) //this bypasses the prop given above
  const filters = useContext(FilterContext) || filtersProp
  return useMemo(
    () => (
      <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
        {filtersProp
          ? cloneElement(filtersProp, {
              resource,
              showFilter,
              displayedFilters,
              filterValues,
              context: 'button',
            })
          : filters && <FilterButton icon={<Filter />} />}
        {hasCreate && <CreateButton icon={<DocumentAdd />} />}
        {hasUploadProp && <ListActionButton label={uploadLabel} icon={<Upload />} to={uploadLinkProp} />}
        {hasImportPorp && <ListActionButton label={importLabel} icon={<DocumentImport />} to={importLinkProp} />}
        {exporter !== false && (
          <ExportButton
            disabled={total === 0}
            resource={resource}
            sort={sort}
            filterValues={filterValues}
            icon={<DocumentExport />}
          />
        )}
      </TopToolbar>
    ),
    /* eslint-disable react-hooks/exhaustive-deps */
    [
      resource,
      displayedFilters,
      filterValues,
      filtersProp,
      showFilter,
      filters,
      total,
      className,
      sort,
      exporter,
      hasCreate,
    ]
  )
}

ListActions.propTypes = {
  className: PropTypes.string,
  sort: PropTypes.any,
  displayedFilters: PropTypes.object,
  exporter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  filters: PropTypes.element,
  filterValues: PropTypes.object,
  hasCreate: PropTypes.bool,
  resource: PropTypes.string,
  onUnselectItems: PropTypes.func.isRequired,
  selectedIds: PropTypes.arrayOf(PropTypes.any),
  showFilter: PropTypes.func,
  total: PropTypes.number,
}

ListActions.defaultProps = {
  selectedIds: [],
  onUnselectItems: () => null,
}

export default ListActions
