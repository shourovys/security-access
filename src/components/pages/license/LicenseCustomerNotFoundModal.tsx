import Icon, { applyIcon, cancelIcon } from '../../../utils/icons'
import t from '../../../utils/translator'
import FormActionButtonsContainer from '../../HOC/style/form/FormActionButtonsContainer'
import Button from '../../atomic/Button'

interface IProps {
  setOpenModal: (openModal: boolean) => void
  onYes: () => void
}

const LicenseCustomerNotFoundModal = ({ setOpenModal, onYes }: IProps) => {
  return (
    <div className="w-full p-4 space-y-2 bg-white rounded-md max-w-md">
      <div className="text-lg font-medium">
        <h2>Can not access license server. Do you want to continue? </h2>
      </div>

      <FormActionButtonsContainer allowsShow padding={false}>
        <Button size="base" onClick={onYes}>
          <Icon icon={applyIcon} />
          <span>{t`Yes`}</span>
        </Button>
        <Button size="base" color="cancel" onClick={() => setOpenModal(false)}>
          <Icon icon={cancelIcon} />
          <span>{t`No`}</span>
        </Button>
      </FormActionButtonsContainer>
    </div>
  )
}

export default LicenseCustomerNotFoundModal
