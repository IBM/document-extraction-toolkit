import { WatsonHealthMagnify } from '@carbon/icons-react'
import { ShowButton as ReactAdminShowButton } from 'react-admin'

const ShowButton = ReactAdminShowButton

ShowButton.defaultProps = {
  icon: <WatsonHealthMagnify />,
}

export default ShowButton
