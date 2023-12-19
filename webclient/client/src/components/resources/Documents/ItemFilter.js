import { Button, useRecordContext } from 'react-admin'
import { Link } from 'react-router-dom'
import { stringify } from 'query-string'
import { Filter } from '@carbon/icons-react'

const stopPropagation = (e) => e.stopPropagation()
const ItemFilter = () => {
  const record = useRecordContext()
  //console.log(record)
  return (
    <Button
      component={Link}
      to={{
        pathname: '/extracted_relations_live',
        search: stringify({
          page: 1,
          perPage: 25,
          sort: 'diagnosed_date',
          order: 'ASC',
          filter: JSON.stringify({ doc_id: record.id }),
        }),
      }}
      label={'ra_custom.action.relations'}
      onClick={stopPropagation}
    >
      <Filter />
    </Button>
  )
}

export default ItemFilter
