import * as React from 'react'
import { styled } from '@mui/material/styles'
import { ReactElement, memo } from 'react'
import PropTypes from 'prop-types'
import { Fab, useMediaQuery, Theme } from '@mui/material'

import { Upload } from '@carbon/icons-react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { useTranslate, useResourceContext, useCreatePath } from 'ra-core'

import { Button } from 'ra-ui-materialui'

/**
 * A generic action button used in ListActions TopToolBar. Based on CreateButton
 *
 * Renders as a regular button on desktop, and a Floating Action Button
 * on mobile.
 *
 * @example // basic usage
 * import { ListActionButton } from '***';
 *
 * const CommentListActionButton = () => (
 *     <ListActionButton label="translated.string" to="/custompath" icon={<CarbonIcon />}/>
 * );
 */
const ListActionButton = (props) => {
  const {
    className,
    icon = defaultIcon,
    label = 'ra.action.upload',
    resource: resourceProp,
    scrollToTop = true,
    variant,
    to,
    ...rest
  } = props

  const resource = useResourceContext(props)
  const createPath = useCreatePath()
  const translate = useTranslate()
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down('md'))

  return isSmall ? (
    <StyledFab
      component={Link}
      to={to}
      state={scrollStates[String(scrollToTop)]}
      color="primary"
      className={clsx(ListActionButtonClasses.floating, className)}
      aria-label={label && translate(label)}
      {...rest}
    >
      {icon}
    </StyledFab>
  ) : (
    <Button
      component={Link}
      to={to}
      state={scrollStates[String(scrollToTop)]}
      className={className}
      label={label}
      variant={variant}
      {...rest}
    >
      {icon}
    </Button>
  )
}

// avoids using useMemo to get a constant value for the link state
const scrollStates = {
  true: { _scrollToTop: true },
  false: {},
}

const defaultIcon = <Upload />

ListActionButton.propTypes = {
  resource: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.element,
  label: PropTypes.string,
}

const PREFIX = 'RaListActionButton'

export const ListActionButtonClasses = {
  floating: `${PREFIX}-floating`,
}

const StyledFab = styled(Fab, {
  name: PREFIX,
  overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
  [`&.${ListActionButtonClasses.floating}`]: {
    color: theme.palette.getContrastText(theme.palette.primary.main),
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 60,
    left: 'auto',
    position: 'fixed',
    zIndex: 1000,
  },
}))

export default memo(ListActionButton, (prevProps, nextProps) => {
  return (
    prevProps.resource === nextProps.resource &&
    prevProps.label === nextProps.label &&
    prevProps.translate === nextProps.translate &&
    prevProps.disabled === nextProps.disabled
  )
})
