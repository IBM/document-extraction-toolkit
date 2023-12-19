import { Edit } from '@carbon/icons-react'
import { EditButton as ReactAdminEditButton } from 'react-admin'

const EditButton = ReactAdminEditButton

EditButton.defaultProps = {
  icon: <Edit />,
  color: 'primary',
}

export default EditButton
