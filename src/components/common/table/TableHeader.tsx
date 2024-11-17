import classNames from 'classnames'
import Checkbox from '../../../components/atomic/Checkbox'
import { ITableHead } from '../../../types/components/table'
import Icon, { downArrowIcon, upArrowIcon } from '../../../utils/icons'

interface IProps {
  order: 'asc' | 'desc'
  orderBy: string
  numSelected?: number
  rowCount?: number
  handleSort: (orderBy: string, order: 'asc' | 'desc') => void
  handleOrder: (order: 'asc' | 'desc') => void
  selectAllRow?: (selected: boolean) => void
  headerData: ITableHead[]
  allRowsNos?: unknown
}

function TableHeader({
  order,
  orderBy,
  numSelected,
  rowCount,
  handleSort,
  handleOrder,
  selectAllRow,
  headerData,
  allRowsNos,
}: IProps) {
  return (
    <thead className="bg-bwTableHeaderBg">
      <tr className="text-sm font-bold text-center">
        {selectAllRow && (
          <th scope="col" className="sticky left-0 w-1 px-3 py-1.5 bg-bwTableHeaderBg">
            <div className="flex items-center justify-start">
              <Checkbox
                value="select-all-row"
                checked={rowCount !== 0 && rowCount === numSelected}
                onChange={(checked) => {
                  selectAllRow(checked)
                }}
                disabled={rowCount === 0}
              />
            </div>
            {/* <div className="absolute top-[50%] transform translate-y-[-50%] right-4 hidden lg:block">
                        {!!numSelected && numSelected}
                    </div> */}
          </th>
        )}
        {headerData.map((item) => (
          <th
            key={item.id}
            scope="col"
            className={classNames(
              'px-4 py-1.5 text-bwTableHeaderBgText whitespace-nowrap',
              item.filter ? 'cursor-pointer' : 'cursor-default'
            )}
            onClick={() => {
              if (item.filter) {
                handleOrder(order === 'asc' ? 'desc' : 'asc')
                handleSort(item.id, order === 'asc' ? 'desc' : 'asc')
              }
            }}
          >
            {item.filter && (
              <>
                <Icon
                  icon={upArrowIcon}
                  className={classNames(
                    'w-2',
                    orderBy === item.id && order === 'asc' && 'text-primary'
                  )}
                />
                <Icon
                  icon={downArrowIcon}
                  className={classNames(
                    'w-2 mr-2',
                    orderBy === item.id && order === 'desc' && 'text-primary'
                  )}
                />
              </>
            )}

            {!item.checkboxAction && item.label}

            {item.checkboxAction && (
              <div className="flex gap-2">
                {item.label}
                <Checkbox
                  value="select-all-row"
                  checked={item.checkboxValue}
                  onChange={(checked) => {
                    item.checkboxAction(item.id, checked, allRowsNos)
                  }}
                />
              </div>
            )}
          </th>
        ))}
      </tr>
    </thead>
  )
}

export default TableHeader
