import classNames from 'classnames'
import { IActionsButton } from '../../types/components/actionButtons'
import Icon from '../../utils/icons'
import Button from '../atomic/Button'
import ButtonWithFileUpload from './ButtonWithFileUpload'
import ActionButton from './ActionButton'

interface IProps {
  actionButtons: IActionsButton[]
  showInSm?: boolean
  allowsShow?: boolean
}
function ActionButtons({ actionButtons, showInSm, allowsShow }: IProps) {
  return (
    <div id="action_buttons_row" className={classNames('flex gap-x-2 lg:gap-x-2 ')}>
      {actionButtons.map((button) => (
        <ActionButton button={button} key={button.text} />
      ))}
    </div>
  )
}

export default ActionButtons
