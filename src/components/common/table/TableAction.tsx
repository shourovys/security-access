import { Menu, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment } from 'react'
import Button from '../../../components/atomic/Button'
import IconButton from '../../../components/atomic/IconButton'
import TextButton from '../../../components/atomic/TextButton'
import { IActionButtonsGroup, IActionsButton } from '../../../types/components/actionButtons'
import { ITableAction } from '../../../types/components/table'
import Icon, { threeDotsIcon } from '../../../utils/icons'
import t from '../../../utils/translator'

import ActionButtons from './../ActionButtons'
import GroupActionButtons from '../GroupActionButtons'

function splitArray<T>(arr?: T[]): [T[], T[]] {
  if (!arr) {
    return [[], []]
  }
  if (arr.length <= 1) {
    return [arr, []]
  }

  const firstTwoItems = arr.slice(0, 2)
  const remainingItems = arr.slice(2)

  return [firstTwoItems, remainingItems]
}

interface IProps {
  tableActions?: ITableAction[]
  numSelected: number
  breadcrumbsActions?: IActionsButton[]
  groupActions?: IActionButtonsGroup
}
function TableAction({ tableActions, breadcrumbsActions, groupActions, numSelected }: IProps) {
  const [firstTwoButtons, restButtons] = splitArray<ITableAction>(tableActions)
  return (
    <>
      <div className="pb-2 md:pb-3 overflow-auto">
        {breadcrumbsActions ? (
          <ActionButtons actionButtons={breadcrumbsActions} allowsShow />
        ) : null}
        {groupActions ? <GroupActionButtons actionButtons={groupActions} allowsShow /> : null}
        <div
          className={classNames(
            'flex items-center gap-3 md:gap-4 mr-3 sm:mr-3.5 md:mr-4',
            tableActions && tableActions?.length > 7
              ? 'justify-start sm:justify-end'
              : 'justify-end'
          )}
        >
          {tableActions?.map((button) => (
            <IconButton
              key={button.tooltip}
              icon={button.icon}
              tooltip={button.tooltip}
              color={button.color}
              iconClass={button.iconClass}
              disabled={numSelected ? button.disabled : true}
              disabledText={t`Select table row`}
              link={button.link}
              onClick={button.onClick}
            />
          ))}

          {/* {breadcrumbsActions ? <ActionButtons actionButtons={breadcrumbsActions} /> : null} */}
        </div>
      </div>

      {/* mobile action buttons in dropdown menu */}
      {tableActions && (
        <div className="flex items-center justify-end w-full gap-3 mb-4 lg:hidden">
          {firstTwoButtons.map((button) => (
            <Button
              key={button.tooltip}
              disabled={numSelected ? button.disabled : true}
              link={button.link}
              onClick={button.onClick}
              size="small"
            >
              <Icon icon={button.icon} />
              <span>{button.tooltip}</span>
            </Button>
          ))}
          {restButtons.length ? (
            <Menu as="div" className="relative">
              <div>
                <Menu.Button className="">
                  <Icon icon={threeDotsIcon} className="px-2 text-xl" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 origin-top-right bg-white rounded-md shadow-lg min-w-max ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {restButtons?.map((buttonData) => (
                    <Menu.Item key={buttonData.tooltip}>
                      <TextButton
                        link={buttonData.link}
                        onClick={buttonData.onClick}
                        icon={buttonData.icon}
                        // color={buttonData.color}
                        iconClass={buttonData.iconClass}
                        // isLoading={buttonData.isLoading}
                        disabled={numSelected ? buttonData.disabled : true}
                        disabledText={t`Select table row`}
                      >
                        {buttonData.tooltip}
                      </TextButton>
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          ) : null}
        </div>
      )}
    </>
  )
}

export default TableAction
