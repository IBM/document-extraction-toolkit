import * as React from 'react'
import PropTypes from 'prop-types'
import { useRecordContext, useLocaleState } from 'react-admin'

const DIVISIONS = [
  { amount: 60, name: 'seconds' },
  { amount: 60, name: 'minutes' },
  { amount: 24, name: 'hours' },
  { amount: 7, name: 'days' },
  { amount: 4.34524, name: 'weeks' },
  { amount: 12, name: 'months' },
  { amount: Number.POSITIVE_INFINITY, name: 'years' },
]

const formatTimeAgo = (date, formatter) => {
  const recordDate = new Date(date)
  if (isNaN(recordDate)) {
    return null
  } else {
    let duration = (recordDate - new Date()) / 1000
    for (let i = 0; i <= DIVISIONS.length; i++) {
      const division = DIVISIONS[i]
      if (Math.abs(duration) < division.amount) {
        return formatter.format(Math.round(duration), division.name)
      }
      duration /= division.amount
    }
  }
}

const RelativeTimeField = (props) => {
  const [locale, setLocale] = useLocaleState()
  const { source } = props
  const formatter = new Intl.RelativeTimeFormat(locale, {
    numeric: 'auto',
  })
  const record = useRecordContext(props)
  return <span>{formatTimeAgo(record[source], formatter)}</span>
}

RelativeTimeField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
  source: PropTypes.string.isRequired,
}

export default RelativeTimeField
