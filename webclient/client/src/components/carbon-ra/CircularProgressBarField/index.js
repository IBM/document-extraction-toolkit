/*
 * Copyright 2022 IBM Corp.
 * IBM Confidential Source Code Materials
 * This Source Code is subject to the license and security terms contained in the license/LICENSE file contained in this source code package.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'
import { useTheme, useRecordContext } from 'react-admin'
import { useMediaQuery } from '@mui/material'

const CircularProgressbarField = ({ source }) => {
  const [theme, setTheme] = useTheme()
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'))
  const record = useRecordContext()
  const value = Math.round(record[source], 0)
  const styles = buildStyles({
    textSize: '16px',
    pathTransitionDuration: 0.5,
    pathColor: theme.ra_custom.interactive || "#4589ff",
  })
  const progressBarProps = {
    value,
    styles,
    strokeWidth: 4,
  }
  // marginTop needed to center the text
  return (
    <div style={{ width: isDesktop ? 60 : 50, height: isDesktop ? 60 : 50 }}>
      <CircularProgressbarWithChildren {...progressBarProps}>
        <div style={{ marginTop: -15 }}>{`${value}%`}</div>
      </CircularProgressbarWithChildren>
    </div>
  )
}

CircularProgressbarField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.object,
  source: PropTypes.string.isRequired,
}

export default CircularProgressbarField