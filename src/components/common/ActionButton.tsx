import classNames from 'classnames'
import { IActionButtonsGroup, IActionsButton } from '../../types/components/actionButtons'
import Icon from '../../utils/icons'
import Button from '../atomic/Button'
import ButtonWithFileUpload from './ButtonWithFileUpload'

interface IActionButtonProps {
  button: IActionsButton
}

function ActionButton({ button }: IActionButtonProps) {
  return (
    <>
      {/* action button */}
      {button?.handleFile ? (
        <ButtonWithFileUpload
          key={button.text}
          handleFile={button.handleFile}
          accept={button.accept}
          disabled={button.disabled}
        >
          <Button
            color={button.color || 'primary'}
            key={button.text}
            size={button.size}
            link={button.link}
            isLoading={button.isLoading}
            disabled={button.disabled}
          >
            <>
              {button.icon && <Icon icon={button.icon} className={button.iconClass} />}
              <span>{button.text}</span>
            </>
          </Button>
        </ButtonWithFileUpload>
      ) : (
        <Button
          color={button.color || 'primary'}
          key={button.text}
          size={button.size}
          link={button.link}
          onClick={button.onClick}
          isLoading={button.isLoading}
          disabled={button.disabled}
          className="w-fit"
        >
          <>
            {button.icon && <Icon icon={button.icon} className={button.iconClass} />}
            <span>{button.text}</span>
          </>
        </Button>
      )}
    </>
  )
}

export default ActionButton
