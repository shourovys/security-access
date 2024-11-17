import Button from '../../../components/atomic/Button'
import { THandleFilterInputChange } from '../../../types/components/common'
import { IAckDashboardFormData } from '../../../types/pages/ackDashboard'
import Icon, { applyIcon } from '../../../utils/icons'
import TableToolbarContainer from '../../HOC/style/table/TableToolbarContainer'
import Input from '../../atomic/Input'
import t from '../../../utils/translator'

interface IProps {
  listFormState: IAckDashboardFormData
  isSubmitting: boolean
  handleSubmit: () => void
  handleInputChange: THandleFilterInputChange
  selected: string[]
}

function AckDashboardTableToolbar({
  listFormState,
  isSubmitting,
  handleSubmit,
  handleInputChange,
  selected,
}: IProps) {
  return (
    <div className="ack">
      <div className="flex sm:gap-x-3 sm:gap-y-2 lg:gap-x-5 ml-1 mb-2">
        <Input
          name="comment"
          placeholder={t`Comment Here`}
          value={listFormState.comment}
          onChange={handleInputChange}
        />

        <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={!selected.length}>
          <Icon icon={applyIcon} />
          <span>{t`Apply`}</span>
        </Button>
      </div>
    </div>
  )
}

export default AckDashboardTableToolbar
