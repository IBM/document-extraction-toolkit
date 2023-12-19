import React from 'react'
import PropTypes from 'prop-types'

const IconField = ({ source, record = {}, iconsMap }) => <span>{iconsMap[record[source]]}</span>

IconField.propTypes = {
  iconsMap: PropTypes.object,
  record: PropTypes.object,
  source: PropTypes.string.isRequired,
}

export default IconField
