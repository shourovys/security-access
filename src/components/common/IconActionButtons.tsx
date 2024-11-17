import classNames from 'classnames'
import IconButton from '../../components/atomic/IconButton'
import { IIconButton } from '../../types/components/iocnButton'

interface IProps {
  actionButtons: IIconButton[]
}
function IconActionButtons({ actionButtons }: IProps) {
  return (
    <>
      {/* action buttons */}
      <div className={classNames('gap-3.5 lg:gap-4')}>
        {actionButtons.map((button, index) => (
          <IconButton
            key={index}
            icon={button.icon}
            tooltip={button.tooltip}
            iconClass={button.iconClass}
            disabled={button.disabled}
            disabledText={button.disabledText}
            color={button.color}
            link={button.link}
            onClick={button.onClick}
          />
        ))}
      </div>
    </>
  )
}

export default IconActionButtons
