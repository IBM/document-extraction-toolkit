/*
 * Copyright 2022 IBM Corp.
 * IBM Confidential Source Code Materials
 * This Source Code is subject to the license and security terms contained in the license/LICENSE file contained in this source code package.
 */
import React, { Children } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { LinearProgress, Link, ReferenceFieldController } from 'react-admin'
import { createStyles, withStyles } from '@material-ui/core/styles'
import sanitizeRestProps from './sanitizeRestProps'

const styles = (theme) =>
  createStyles({
    link: {
      color: theme.palette.primary.main,
    },
  })

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = (e) => e.stopPropagation()

export const ReferenceFieldView = ({
  allowEmpty,
  basePath,
  children,
  className,
  classes = {},
  loading,
  record,
  reference,
  referenceRecord,
  resource,
  resourceLinkPath,
  source,
  translateChoice = false,
  ...rest
}) => {
  if (loading) {
    return <LinearProgress />
  }

  if (resourceLinkPath) {
    return (
      <Link to={resourceLinkPath} className={className} onClick={stopPropagation}>
        {React.cloneElement(Children.only(children), {
          className: classnames(
            children.props.className,
            classes.link // force color override for Typography components
          ),
          record: referenceRecord,
          resource: reference,
          allowEmpty,
          basePath,
          translateChoice,
          ...sanitizeRestProps(rest),
        })}
      </Link>
    )
  }

  return React.cloneElement(Children.only(children), {
    record: referenceRecord,
    resource: reference,
    allowEmpty,
    basePath,
    translateChoice,
    ...sanitizeRestProps(rest),
  })
}

ReferenceFieldView.propTypes = {
  allowEmpty: PropTypes.bool,
  basePath: PropTypes.string,
  children: PropTypes.element,
  className: PropTypes.string,
  classes: PropTypes.object,
  loading: PropTypes.bool,
  record: PropTypes.object,
  reference: PropTypes.string,
  referenceRecord: PropTypes.object,
  resource: PropTypes.string,
  resourceLinkPath: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.object]),
  source: PropTypes.string,
  translateChoice: PropTypes.bool,
}

const ReferenceField = ({ children, ...props }) => {
  if (React.Children.count(children) !== 1) {
    throw new Error('<ReferenceField> only accepts a single child')
  }

  return (
    <ReferenceFieldController {...props}>
      {(controllerProps) => (
        <ReferenceFieldView
          {...props}
          {...{
            children,
            ...controllerProps,
            resourceLinkPath: !props.link
              ? false
              : {
                  pathname: controllerProps.resourceLinkPath,
                  state: { modal: true },
                },
          }}
        />
      )}
    </ReferenceFieldController>
  )
}

ReferenceField.propTypes = {
  addLabel: PropTypes.bool,
  allowEmpty: PropTypes.bool.isRequired,
  basePath: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  classes: PropTypes.object,
  className: PropTypes.string,
  cellClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  label: PropTypes.string,
  record: PropTypes.object,
  reference: PropTypes.string.isRequired,
  resource: PropTypes.string,
  sortBy: PropTypes.string,
  source: PropTypes.string.isRequired,
  translateChoice: PropTypes.func,
  link: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
}

ReferenceField.defaultProps = {
  allowEmpty: false,
  classes: {},
  link: 'edit',
  record: {},
}

const EnhancedReferenceField = withStyles(styles)(ReferenceField)

EnhancedReferenceField.defaultProps = {
  addLabel: true,
}

EnhancedReferenceField.displayName = 'EnhancedReferenceField'

export default EnhancedReferenceField
