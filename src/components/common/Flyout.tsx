import { Popover, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface IProps {
  children: JSX.Element | JSX.Element[] | string
  flyout: ({ close }: { close: () => void }) => JSX.Element
  className?: string
}

export default function Flyout({ children, flyout: FlyoutComponent, className }: IProps) {
  return (
    <Popover as="div" className={className}>
      <Popover.Button className="flex items-center justify-center max-w-xs gap-2 text-sm md:h-full">
        {children}
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Popover.Panel className="absolute left-0 right-0">
          {({ close }) => (
            <div className="w-full max-w-full min-w-max">
              {<FlyoutComponent close={() => close()} />}
            </div>
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
