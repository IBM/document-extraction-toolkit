import * as React from 'react'
import PropTypes from 'prop-types'

import { TopToolbar, ListButton } from 'react-admin'
import { useResourceDefinition } from 'ra-core'

/**
 * Action Toolbar for the Create view
 *
 * Internal component. If you want to add or remove actions for a Create view,
 * write your own CreateActions Component. Then, in the <Create> component,
 * use it in the `actions` prop to pass a custom component.
 *
 * @example
 *     import Button from '@mui/material/Button';
 *     import { TopToolbar, Create, ListButton } from 'react-admin';
 *
 *     const PostCreateActions = () => (
 *         <TopToolbar>
 *             <ListButton />
 *             // Add your custom actions here //
 *             <Button color="primary" onClick={customAction}>Custom Action</Button>
 *         </TopToolbar>
 *     );
 *
 *     export const PostCreate = (props) => (
 *         <Create actions={<PostCreateActions />} {...props}>
 *             ...
 *         </Create>
 *     );
 */
const CreateActions = ({ className, ...rest }) => {
  const { hasList } = useResourceDefinition(rest)
  return (
    <TopToolbar className={className} {...sanitizeRestProps(rest)}>
      {hasList && <ListButton />}
    </TopToolbar>
  )
}

const sanitizeRestProps = ({ className = null, hasList = null, resource = null, ...rest }) => rest

CreateActions.propTypes = {
  className: PropTypes.string,
  hasCreate: PropTypes.bool,
  hasEdit: PropTypes.bool,
  hasShow: PropTypes.bool,
  hasList: PropTypes.bool,
  resource: PropTypes.string,
}

export default CreateActions
