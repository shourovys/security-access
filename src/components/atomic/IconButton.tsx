import classNames from 'classnames'
import Icon from '../../utils/icons'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IIconButton } from '../../types/components/iocnButton'
import t from '../../utils/translator'

function IconButton({
  color = 'black',
  icon,
  tooltip,
  iconClass,
  disabled,
  disabledText,
  link,
  onClick,
}: IIconButton) {
  const [isHover, setIsHover] = useState(false)

  const styleClass = classNames(
    'text-lg outline-none group',
    color === 'primary' && 'text-primary',
    color === 'red' && 'text-red-500 ',
    color === 'gray' && 'text-gray-500 ',
    color === 'black' && 'text-black',
    disabled ? 'opacity-20' : 'opacity-80 hover:opacity-100',
    iconClass
  )
  return (
    <div className="relative flex max-w-min">
      {disabled ? ( // if disable then show button without action
        <button
          className="p-1"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <Icon icon={icon} className={styleClass} />
        </button>
      ) : link ? ( // if not disable and link is present
        <Link to={link}>
          <button
            className="p-1"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <Icon icon={icon} className={styleClass} />
          </button>
        </Link>
      ) : (
        // if not disable and onClick is present
        <button
          className="p-1"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onClick={onClick}
        >
          <Icon icon={icon} className={styleClass} />
        </button>
      )}

      {(disabledText || tooltip) && (
        <span
          className={classNames(
            'whitespace-nowrap absolute hidden md:block px-1.5 pt-0.5 pb-1 m-2 mx-auto text-xs text-gray-100 transition-opacity -translate-x-1/2 translate-y-full bg-gray-800 rounded-md left-1/2 z-40',
            isHover ? 'opacity-100' : 'opacity-0'
          )}
        >
          {t`${disabled && disabledText ? disabledText : tooltip}`}
        </span>
      )}
    </div>
  )
}

export default IconButton
