/*
 * Copyright 2022 IBM Corp.
 * IBM Confidential Source Code Materials
 * This Source Code is subject to the license and security terms contained in the license/LICENSE file contained in this source code package.
 */
import React from 'react'
import { useTranslate } from 'react-admin'
import Tooltip from '@mui/material/Tooltip'
import { Typography } from '@mui/material'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@carbon/react'

const StaticTable = ({ heading, translateRows, ...props }) => {
  const translate = useTranslate()
  return (
    <div>
      <Typography variant="body2">{translate(heading)}</Typography>
      <Table>
        <TableHead>
          <TableRow>
            {props.data.headers.map((header, i) => (
              <Tooltip tooltipTitle={translate(header.tooltip)} placement="top" key={i}>
                <TableCell>{translate(header.title)}</TableCell>
              </Tooltip>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.rows.map((row, i) => (
            <TableRow key={i}>
              {Object.keys(row).map((field, j) => (
                <TableCell key={`${i}-${j}`}>{translateRows ? translate(row[field]) : row[field]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default StaticTable
