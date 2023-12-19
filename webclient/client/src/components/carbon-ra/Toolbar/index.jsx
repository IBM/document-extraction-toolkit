import * as React from 'react'
import { styled } from '@mui/material/styles'
import { Children, ReactNode } from 'react'
import PropTypes from 'prop-types'
import { Toolbar as MuiToolbar, useMediaQuery } from '@mui/material'
import clsx from 'clsx'

import { SaveButton, DeleteButton } from 'react-admin'
import { Save, TrashCan } from '@carbon/icons-react'


/**
 * The Toolbar displayed at the bottom of forms.
 *
 * @example Always enable the <SaveButton />
 *
 * import * as React from 'react';
 * import {
 *     Create,
 *     DateInput,
 *     TextInput,
 *     SimpleForm,
 *     Toolbar,
 *     SaveButton,
 *     required,
 * } from 'react-admin';
 *
 * const now = new Date();
 * const defaultSort = { field: 'title', order: 'ASC' };
 *
 * const MyToolbar = props => (
 *     <Toolbar {...props} >
 *         <SaveButton alwaysEnable />
 *     </Toolbar>
 * );
 *
 * const CommentCreate = () => (
 *     <Create>
 *         <SimpleForm redirect={false} toolbar={<MyToolbar />}>
 *             <TextInput
 *                 source="author.name"
 *                 fullWidth
 *             />
 *             <DateInput source="created_at" defaultValue={now} />
 *             <TextInput source="body" fullWidth={true} multiline={true} />
 *         </SimpleForm>
 *     </Create>
 * );
 *
 * @typedef {Object} Props the props you can use (other props are injected by the <SimpleForm>)
 * @prop {ReactElement[]} children Customize the buttons you want to display in the <Toolbar>.
 *
 */
const Toolbar = (props) => {
  const { children, className, resource, ...rest } = props

  const isXs = useMediaQuery((theme) => theme.breakpoints.down('sm'))

  return (
    <StyledToolbar
      className={clsx(
        {
          [ToolbarClasses.mobileToolbar]: isXs,
          [ToolbarClasses.desktopToolbar]: !isXs,
        },
        className
      )}
      role="toolbar"
      {...rest}
    >
      {Children.count(children) === 0 ? (
        <div className={ToolbarClasses.defaultToolbar}>
          <SaveButton icon={<Save />} />
          <DeleteButton resource={resource} icon={<TrashCan />} />
        </div>
      ) : (
        children
      )}
    </StyledToolbar>
  )
}

Toolbar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,

  resource: PropTypes.string,
}

const PREFIX = 'RaToolbarCarbon'

export const ToolbarClasses = {
  desktopToolbar: `${PREFIX}-desktopToolbar`,
  mobileToolbar: `${PREFIX}-mobileToolbar`,
  defaultToolbar: `${PREFIX}-defaultToolbar`,
}

const StyledToolbar = styled(MuiToolbar, {
  name: PREFIX,
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  backgroundColor: theme.ra_custom.table,

  [`&.${ToolbarClasses.desktopToolbar}`]: {},

  [`&.${ToolbarClasses.mobileToolbar}`]: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '16px',
    width: '100%',
    boxSizing: 'border-box',
    flexShrink: 0,
    zIndex: 2,
  },

  [`& .${ToolbarClasses.defaultToolbar}`]: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
  },
}))

export default Toolbar
