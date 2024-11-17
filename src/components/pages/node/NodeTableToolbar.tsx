import { THandleFilterInputChange } from '../../../types/components/common'
import { INodeFilters } from '../../../types/pages/node'
import Icon, { applyIcon, resetIcon } from '../../../utils/icons'
import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'
import Button from '../../atomic/Button'
import Input from '../../atomic/Input'
import t from '../../../utils/translator'

interface IProps {
  filterState: INodeFilters
  handleFilterApply: () => void
  handleFilterStateReset: () => void
  handleInputChange: THandleFilterInputChange
}

function NodeTableToolbar({
  filterState,
  handleFilterApply,
  handleFilterStateReset,
  handleInputChange,
}: IProps) {
  return (
    <TableToolbarContainer>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5">
        <Input
          name="NodeNo"
          placeholder={t`Node No`}
          value={filterState.NodeNo}
          onChange={handleInputChange}
        />
        <Input
          name="NodeName"
          placeholder={t`Node Name`}
          value={filterState.NodeName}
          onChange={handleInputChange}
        />
        <Input
          name="Mac"
          placeholder={t`MAC`}
          value={filterState.Mac}
          onChange={handleInputChange}
        />
        <Input
          name="Address"
          placeholder={t`Address`}
          value={filterState.Address}
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

export default NodeTableToolbar
