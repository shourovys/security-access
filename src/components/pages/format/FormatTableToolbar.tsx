import { THandleFilterInputChange } from '../../../types/components/common'
import { IFormatFilters } from '../../../types/pages/format'
import Icon, { applyIcon, resetIcon } from '../../../utils/icons'
import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'
import Button from '../../atomic/Button'
import Input from '../../atomic/Input'
import t from '../../../utils/translator'

interface IProps {
  filterState: IFormatFilters
  handleFilterApply: () => void
  handleFilterStateReset: () => void
  handleInputChange: THandleFilterInputChange
}

function FormatTableToolbar({
  filterState,
  handleFilterApply,
  handleFilterStateReset,
  handleInputChange,
}: IProps) {
  return (
    <TableToolbarContainer>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5">
        <Input
          name="FormatNo"
          placeholder={t`Format No`}
          value={filterState.FormatNo}
          onChange={handleInputChange}
        />
        <Input
          name="FormatName"
          placeholder={t`Format Name`}
          value={filterState.FormatName}
          onChange={handleInputChange}
        />
        <Input
          name="TotalLength"
          placeholder={t`Total Length`}
          value={filterState.TotalLength}
          onChange={handleInputChange}
        />
        <Input
          name="FacilityCode"
          placeholder={t`Facility Code`}
          value={filterState.FacilityCode}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex gap-3.5 lg:gap-4 pt-3">
        <Button onClick={handleFilterApply}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
        <Button color="cancel" onClick={handleFilterStateReset}>
          <Icon icon={resetIcon} />
          <span>{t`Reset`}</span>
        </Button>
      </div>
    </TableToolbarContainer>
  )
}

export default FormatTableToolbar
