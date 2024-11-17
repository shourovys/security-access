import classNames from 'classnames'
import { TSelectValue } from '../../../components/atomic/Selector'
import useUpdateRouteQuery from '../../../hooks/useUpdateRouteQuery'
import Select from 'react-tailwindcss-select'
import t from '../../../utils/translator'

interface IProps {
  totalRows: number
  rowsPerPage: number
  currentPath: string
  onRowsPerPageChange?: (_rowsPerPage: number) => void
  disabled?: boolean
}

const RowsPerPageSelector = ({
  totalRows,
  rowsPerPage,
  currentPath,
  onRowsPerPageChange,
  disabled,
}: IProps) => {
  const updateRouteQuery = useUpdateRouteQuery()

  const handleRowsPerPageChange = (selected: TSelectValue) => {
    if (onRowsPerPageChange && selected && !Array.isArray(selected)) {
      updateRouteQuery({
        query: { page: 1, rowsPerPage: selected.value },
        pathName: currentPath,
      })
      onRowsPerPageChange(Number(selected.value))
    }
  }

  return (
    <div className="items-center hidden gap-2 md:flex">
      {/* row par page selector  */}
      <h6 className="text-sm whitespace-nowrap">{t`Rows Per Page:`}</h6>
      <Select
        primaryColor="#006A4E"
        value={{ label: rowsPerPage.toString(), value: rowsPerPage.toString() }}
        onChange={!disabled ? handleRowsPerPageChange : () => {}}
        isMultiple={false}
        isDisabled={!totalRows || disabled}
        classNames={{
          menuButton: (arg) =>
            classNames(
              'flex items-center justify-between text-sm font-normal bg-white border border-solid border-gray-300 h-[30px] rounded-md focus:text-gray-700',
              !arg?.isDisabled && 'focus:bg-white focus:border-primary focus:outline-none ',
              arg?.isDisabled && 'important_disable_bg'
            ),
        }}
        //modified row per page according to previous version --rubel
        options={[
          { value: '10', label: t`10` },
          { value: '20', label: t`20` },
          { value: '50', label: t`50` },
          { value: '100', label: t`100` },
        ]}
        isClearable={false}
      />
    </div>
  )
}

export default RowsPerPageSelector
