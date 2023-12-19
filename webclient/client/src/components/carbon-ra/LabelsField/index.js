import { cloneElement } from 'react'
import { ArrayField, SingleFieldList, ChipField } from 'react-admin'

const StringToLabelObject = ({ record, children, ...rest }) => {
  return cloneElement(children, {
    record: { label: record },
    ...rest,
  })
}

const LabelsField = ({ ...rest }) => {
  return (
    <ArrayField {...rest}>
      <SingleFieldList link={false}>
        <StringToLabelObject>
          <ChipField source="label" />
        </StringToLabelObject>
      </SingleFieldList>
    </ArrayField>
  )
}

export default LabelsField
