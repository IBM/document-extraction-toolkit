import { Datagrid as ReactAdminDatagrid } from 'react-admin'
import { styled } from '@mui/system'

const Datagrid = ReactAdminDatagrid

const styles = ({ theme }) => {
  return (
    {
      '& .RaDatagrid-headerCell': {
        backgroundColor: theme.ra_custom.tableHeader,
        fontWeight: 'bold',
      },
      '& .RaDatagrid-tbody': {
        backgroundColor: theme.ra_custom.table,
      },
      '& .RaDatagrid-row': {
        ':hover': {
          backgroundColor: theme.ra_custom.trhover,
        },
      },
    }
  )
}

export default styled(Datagrid)(styles)
