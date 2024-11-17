import { TSize } from '../../../types/components/common'
import LoadingSvg from './LoadingSvg'
import t from '../../../utils/translator'

interface IProps {
  size?: TSize
}

function LoadingTextWithSvg({ size }: IProps) {
  return (
    <>
      <LoadingSvg size={size} />
      {t`Loading...`}
    </>
  )
}

export default LoadingTextWithSvg
