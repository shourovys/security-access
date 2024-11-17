import { TEXTAREA_FIELD_HEIGHT } from '../../../utils/config'

function TextareaLoading() {
  return (
    <div
      className={`h-[${TEXTAREA_FIELD_HEIGHT}] w-full loading rounded-md`}
      style={{ height: TEXTAREA_FIELD_HEIGHT }}
    />
  )
}

export default TextareaLoading
