import { MuiChipsInput } from 'mui-chips-input'
import { useInput, useTranslateLabel } from 'react-admin'

const ChipsInput = (props) => {
  const { onChange, onBlur, ...rest } = props
  const translateLabel = useTranslateLabel()
  const {
    field,
    fieldState: { isTouched, invalid, error },
    formState: { isSubmitted },
    isRequired,
  } = useInput({
    // Pass the event handlers to the hook but not the component as the field property already has them.
    // useInput will call the provided onChange and onBlur in addition to the default needed by react-hook-form.
    onChange,
    onBlur,
    ...props,
  })
  // manually determine if initial input value was null, in order to avoid crashing this component
  if (!field.value) {
    field.value = []
  }
  return (
    <MuiChipsInput
      {...field}
      label={translateLabel({ label: props.label, resource: props.resource, source: props.source })}
      error={(isTouched || isSubmitted) && invalid}
      helperText={(isTouched || isSubmitted) && invalid ? error : ''}
      required={isRequired}
      {...rest}
    />
  )
}

export default ChipsInput
