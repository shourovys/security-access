import { THandleFilterInputChange } from '../../../types/components/common'
import {
  IArchiveScheduleFilters,
  archiveScheduleMediaOptions,
} from '../../../types/pages/archiveSchedule'
import Icon, { applyIcon, resetIcon } from '../../../utils/icons'
import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'
import Button from '../../atomic/Button'
import Input from '../../atomic/Input'
import Selector from '../../atomic/Selector'
import t from '../../../utils/translator'

interface IProps {
  filterState: IArchiveScheduleFilters
  handleFilterApply: () => void
  handleFilterStateReset: () => void
  handleInputChange: THandleFilterInputChange
}

function ArchiveScheduleTableToolbar({
  filterState,
  handleFilterApply,
  handleFilterStateReset,
  handleInputChange,
}: IProps) {
  return (
    <TableToolbarContainer>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5">
        <Input
          name="ArchiveNo"
          placeholder={t`Archive No`}
          value={filterState.ArchiveNo}
          onChange={handleInputChange}
        />
        <Input
          name="ArchiveName"
          placeholder={t`Archive Name`}
          value={filterState.ArchiveName}
          onChange={handleInputChange}
        />
        <Selector
          name="Media"
          placeholder={t`Media`}
          value={filterState.Media}
          options={archiveScheduleMediaOptions}
          isClearable
          onChange={handleInputChange}
        />
      </div>
      <div className="flex gap-3.5 lg:gap-4">
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

export default ArchiveScheduleTableToolbar
