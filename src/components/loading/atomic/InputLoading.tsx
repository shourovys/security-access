import { INPUT_FIELD_HEIGHT } from '../../../utils/config'

function InputLoading() {
  return (
    <div
      className={`h-[${INPUT_FIELD_HEIGHT}] w-full loading rounded-md`}
      style={{ height: INPUT_FIELD_HEIGHT }}
    />
  )
}

export default InputLoading
