import { ListActions } from '../../carbon-ra'

const CustomListActions = () => (
  <ListActions
    hasUpload
    hasCreate={false}
    uploadLink="/documents/upload"
  />
)

export default CustomListActions
