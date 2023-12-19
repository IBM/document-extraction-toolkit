import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'
import { useTranslate, CreateButton, useResourceContext, useResourceDefinition, useListContext } from 'react-admin'
import { DocumentAdd, Upload, DocumentImport } from '@carbon/icons-react'
import { Grid, Column } from '@carbon/react'
import { ListActionButton } from 'components/carbon-ra'
import { Tools } from '@carbon/pictograms-react'

// TODO: maybe make this leverage useResourceContext and make it more ployglot or continue to rely on i18n
const Empty = (props) => {
  const { hasUpload, importLink, uploadLink, hasImport, EmptyIcon, emptyMesage, emptyHint, importLabel, uploadLabel } =
    props
  const translate = useTranslate()
  const resource = useResourceContext(props)
  const { hasCreate } = useResourceDefinition(props)
  const importLinkFinal = importLink ? importLink : `/${resource}/import`
  const uploadLinkFinal = uploadLink ? uploadLink : `/${resource}/upload`
  return (
    <Grid>
      <Column lg={7} />
      <Column lg={9}>{EmptyIcon}</Column>
      <Column lg={6} />
      <Column lg={10}>
        <Typography variant="h4" paragraph>
          {translate(`resources.${resource}.no_data`)}
        </Typography>
        <Typography variant="body1">{translate(`resources.${resource}.no_data_hint`)}</Typography>
        <Grid>
          {hasCreate && (
            <Column lg={1}>
              <CreateButton icon={<DocumentAdd />} />
            </Column>
          )}
          {hasUpload && (
            <Column lg={1}>
              <ListActionButton label={uploadLabel} icon={<Upload />} to={uploadLinkFinal} />
            </Column>
          )}
          {hasImport && (
            <Column lg={1}>
              <ListActionButton label={importLabel} icon={<DocumentImport />} to={importLinkFinal} />
            </Column>
          )}
        </Grid>
      </Column>
    </Grid>
  )
}

Empty.propTypes = {
  hasCreate: PropTypes.bool,
  hasUpload: PropTypes.bool,
  hasImport: PropTypes.bool,
  importLink: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  uploadLink: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  emptyMesage: PropTypes.string,
  emptyHint: PropTypes.string,
  EmptyIcon: PropTypes.element,
}

Empty.defaultProps = {
  EmptyIcon: <Tools />,
  importLink: false,
  uploadLink: false,
  emptyMesage: 'No Data',
  emptyHint: 'Please add some data',
  uploadLabel: 'ra_custom.action.upload',
  importLabel: 'ra_custom.action.import',
}
export default Empty
