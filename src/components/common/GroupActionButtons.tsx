import classNames from 'classnames'
import { IActionButtonsGroup } from '../../types/components/actionButtons'
import ActionButton from './ActionButton'

interface IProps {
  actionButtons: IActionButtonsGroup
  showInSm?: boolean
  allowsShow?: boolean
}

function GroupActionButtons({ actionButtons, showInSm, allowsShow }: IProps) {
  return (
    <div id="action_buttons_row" className={classNames('flex gap-x-6')}>
      {Object.entries(actionButtons).map(([group, buttons], index) => (
        <div key={group} className={'flex gap-x-2 flex-shrink-0'}>
          {buttons.map((button) => (
            <ActionButton button={button} key={button.text} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default GroupActionButtons
