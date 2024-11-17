import { THandleInputChange } from '../../../types/components/common'
import { INewFormErrors } from '../../../types/pages/common'
import { INodeScanFormData } from '../../../types/pages/nodeScan'
import Icon, { scanIcon } from '../../../utils/icons'
import t from '../../../utils/translator'
import Button from '../../atomic/Button'
import Input from '../../atomic/Input'

interface IProps {
  formData: INodeScanFormData
  handleInputChange: THandleInputChange
  formErrors: INewFormErrors<INodeScanFormData>
  // refetchListData: () => void
}

function NodeTableToolbar({ formData, handleInputChange, formErrors }: IProps) {
  return (
    <div className="pb-3 space-y-2 md:pb-4">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-3 sm:gap-y-2 lg:gap-x-5">
        <Input
          name="UserId"
          placeholder={t`User ID`}
          value={formData.UserId}
          onChange={handleInputChange}
          error={formErrors.UserId}
        />
        <Input
          name="Password"
          placeholder={t`Password`}
          value={formData.Password}
          onChange={handleInputChange}
          error={formErrors.Password}
        />
      </div>
      {/* <div className="flex gap-3.5 lg:gap-4">
        <Button onClick={refetchListData}>
          <Icon icon={scanIcon} />
          <span>{t`Scan`}</span>
        </Button>
      </div> */}
    </div>
  )
}

export default NodeTableToolbar
