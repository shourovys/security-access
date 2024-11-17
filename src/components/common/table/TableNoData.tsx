import { TABLE_ROW_HEIGHT, TABLE_ROW_PER_PAGE } from '../../../utils/config'
import EmptyContent from '../EmptyContent'
import t from '../../../utils/translator'

interface IProps {
  isNotFound: boolean
  tableRowPerPage?: number
  tableRowHeight?: number
}

export default function TableNoData({
  isNotFound,
  tableRowPerPage = TABLE_ROW_PER_PAGE,
  tableRowHeight = TABLE_ROW_HEIGHT,
}: IProps) {
  if (isNotFound) {
    return (
      <div className="flex" style={{ height: tableRowPerPage * tableRowHeight }}>
        <EmptyContent title={t`No Data Found!`} />
      </div>
    )
  }
  return null
}
