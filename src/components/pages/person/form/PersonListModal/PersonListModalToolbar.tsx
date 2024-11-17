import TableToolbarContainer from '../../../../../components/HOC/style/table/TableToolbarContainer'
import Button from '../../../../../components/atomic/Button'
import Input from '../../../../../components/atomic/Input'
import { THandleFilterInputChange } from '../../../../../types/components/common'
import { IPersonFilters } from '../../../../../types/pages/person'
import Icon, { applyIcon, resetIcon } from '../../../../../utils/icons'
import t from '../../../../../utils/translator'

interface IProps {
  filterState: IPersonFilters
  handleFilterApply: () => void
  handleFilterStateReset: () => void
  handleInputChange: THandleFilterInputChange
}

function PersonListModalToolbar({
  filterState,
  handleFilterApply,
  handleFilterStateReset,
  handleInputChange,
}: IProps) {
  return (
    <TableToolbarContainer padding={false}>
      <div>
        <div className="grid grow grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 sm:gap-x-3 sm:gap-y-2 lg:gap-x-4">
          <Input
            name="PersonNo"
            placeholder={t`Person No`}
            value={filterState.PersonNo}
            onChange={handleInputChange}
          />
          <Input
            name="FirstName"
            placeholder={t`First Name`}
            value={filterState.FirstName}
            onChange={handleInputChange}
          />
          <Input
            name="LastName"
            placeholder={t`Last Name`}
            value={filterState.LastName}
            onChange={handleInputChange}
          />

          {/* <Input
            name="Email"
            placeholder={t`Email`}
            value={filterState.Email}
            onChange={handleInputChange}
          /> */}
        </div>
        <div className="flex gap-3.5 lg:gap-4 my-2">
          <Button onClick={handleFilterApply}>
            <Icon icon={applyIcon} />
            <span>{t`Apply`}</span>
          </Button>
          <Button color="cancel" onClick={handleFilterStateReset}>
            <Icon icon={resetIcon} />
            <span>{t`Reset`}</span>
          </Button>
        </div>
      </div>
    </TableToolbarContainer>
  )
}

export default PersonListModalToolbar
