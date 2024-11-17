import classNames from 'classnames'
import { ReactNode } from 'react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import Checkbox from '../../components/atomic/Checkbox'
import IconActionButtons from '../../components/common/IconActionButtons'
import { IActionsButton } from '../../types/components/actionButtons'
import { THandleInputSelect } from '../../types/components/common'
import { IIconButton } from '../../types/components/iocnButton'
import Icon, { TIcon } from '../../utils/icons'
import ActionButtons from '../common/ActionButtons'

interface IProps {
  header?: string
  icon?: TIcon
  twoPart?: boolean
  headerActionButtons?: IActionsButton[]
  headerIconButtons?: IIconButton[]
  padding?: boolean
  masonry?: boolean
  middleComponent?: ReactNode
  children: ReactNode
  // props for checkbox in header
  selectName?: string
  isSelected?: boolean
  handleSelect?: THandleInputSelect
  showChidden?: boolean
}

function FormCardWithHeader({
  icon,
  header,
  twoPart = true,
  headerActionButtons,
  headerIconButtons,
  padding = true,
  masonry,
  middleComponent,
  children,
  selectName,
  isSelected,
  handleSelect,
  showChidden = true,
}: IProps) {
  return (
    <div className="w-full rounded-md bg-formCardBodyBg overscroll-auto">
      <div
        className={classNames(
          'px-4 py-1 space-y-4 bg-formCardHeaderBg sm:space-y-0',
          showChidden ? 'rounded-t-md' : 'rounded-md'
        )}
      >
        <div className="flex items-center justify-between ">
          <h2 className="flex items-center gap-2 text-base text-formCardHeader md:font-medium">
            {handleSelect && (
              <Checkbox
                value={header!}
                checked={isSelected}
                onChange={(checked) => {
                  handleSelect(selectName || header!, checked)
                }}
              />
            )}
            <Icon icon={icon!} />
            {header}
          </h2>
          {middleComponent && <div className="hidden sm:block">{middleComponent}</div>}
          <div className="flex items-center gap-8 lg:items-stretch">
            {headerActionButtons ? <ActionButtons actionButtons={headerActionButtons} /> : null}
            {headerIconButtons ? <IconActionButtons actionButtons={headerIconButtons} /> : null}
          </div>
        </div>
        {middleComponent && <div className="block sm:hidden">{middleComponent}</div>}
      </div>
      {showChidden && (
        <>
          {twoPart ? (
            masonry ? (
              <section className="px-4 py-3 h-fit basis-1/2 max-h-min ">
                <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 640: 2 }}>
                  <Masonry gutter="0.75rem" className="masonry_inputs_parent">
                    {children}
                  </Masonry>
                </ResponsiveMasonry>
              </section>
            ) : (
              <section className="grid grid-cols-1 px-4 py-3 gap-x-8 gap-y-3 sm:grid-cols-2">
                {children}
              </section>
            )
          ) : (
            <section className={classNames('space-y-3', padding && 'px-4 py-3')}>
              {children}
            </section>
          )}
        </>
      )}
    </div>
  )
}

export default FormCardWithHeader
