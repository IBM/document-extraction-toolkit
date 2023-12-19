/*
 * Copyright 2022 IBM Corp.
 * IBM Confidential Source Code Materials
 * This Source Code is subject to the license and security terms contained in the license/LICENSE file contained in this source code package.
 */
import React from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import Typography from '@material-ui/core/Typography'
import classnames from 'classnames'
import { withStyles } from '@material-ui/core/styles'

import sanitizeRestProps from './sanitizeRestProps'
import { ExpandButton } from 'components/custom-react-admin'

const MAX_CHARACTER_LIMIT = 250

const styles = (theme) => ({
  span: {
    display: 'inline',
  },
})

class TextField extends React.Component {
  static defaultProps = {
    addLabel: true,
    defaultExpanded: false,
    maxCharacterLimit: MAX_CHARACTER_LIMIT,
  }

  constructor(props) {
    super(props)

    this.state = {
      expand: this.props.defaultExpanded,
    }
  }

  onClick = (e) => {
    // useful to prevent click bubbling in a datagrid with rowClick
    e.stopPropagation()
    this.setState({ expand: !this.state.expand })
  }

  render() {
    const { className, classes, source, maxCharacterLimit, record = {}, ...rest } = this.props
    const value = get(record, source)
    const text = value && typeof value !== 'string' ? JSON.stringify(value) : value
    const maxCharacterLimitExceeded = text ? text.length > maxCharacterLimit : false

    let output = text

    if (maxCharacterLimitExceeded && !this.state.expand) {
      output = `${text.substring(0, maxCharacterLimit)}...`
    }

    return (
      <>
        <Typography
          component="span"
          variant="body1"
          className={classnames(classes.span, className)}
          {...sanitizeRestProps(rest)}
        >
          {output}
        </Typography>
        {maxCharacterLimitExceeded ? (
          <ExpandButton key="expand-collapse-btn" onClick={this.onClick} expanded={this.state.expand} />
        ) : null}
      </>
    )
  }
}

TextField.propTypes = {
  ...Typography.propTypes,
  addLabel: PropTypes.bool,
  sortBy: PropTypes.string,
  source: PropTypes.string,
  label: PropTypes.string,
  sortable: PropTypes.bool,
  className: PropTypes.string,
  cellClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  textAlign: PropTypes.oneOf(['right', 'left']),
  defaultExpanded: PropTypes.bool,
  maxCharacterLimit: PropTypes.number,
}

export default withStyles(styles)(TextField)
