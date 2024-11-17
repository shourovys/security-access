import { ReactNode } from 'react'
import { IActionsButton } from '../../../types/components/actionButtons'
import { IIconButton } from '../../../types/components/iocnButton'
import { TIcon, cancelIcon } from '../../../utils/icons'
import FormCardWithHeader from '../FormCardWithHeader'
import Modal from './Modal'

interface IProps {
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
  icon: TIcon
  headerTitle: string
  isCancelable?: boolean
  headerActionButtons?: IActionsButton[]
  widthClass?: 'max-w-5xl' | 'max-w-6xl' | 'max-w-7xl' | string
  children: ReactNode
}

const CardModal = ({
  openModal,
  setOpenModal,
  icon,
  headerTitle,
  isCancelable = true,
  headerActionButtons,
  widthClass,
  children,
}: IProps) => {
  // Define the actions for the Form card header
  const headerIconButtons: IIconButton[] = [
    {
      icon: cancelIcon,
      onClick: () => setOpenModal(false),
    },
  ]

  return (
    <Modal openModal={openModal} setOpenModal={setOpenModal} >
      <FormCardWithHeader
        icon={icon}
        header={headerTitle}
        twoPart={false}
        padding={false}
        headerIconButtons={isCancelable ? headerIconButtons : []}
        headerActionButtons={headerActionButtons}
      >
        {children}
      </FormCardWithHeader>
    </Modal>
  )
}

export default CardModal
